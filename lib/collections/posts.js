Posts = new Mongo.Collection('posts');

//autoriza fazer update ou remove de post se for o nosso documento "ownsDocument" que está no permissions.js
Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});
//faz deny caso tente alterar algo que não seja url ou title
    // may only edit the following two fields:
    //pega nos elementos todos que não sejam url ou titulo, se o tamanho for > 0 é pq estão a tentar editar algo q n devem e vai fazer         //deny do update
Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});


Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

validatePost = function (post) {
  var errors = {};
  if (!post.title)
    errors.title = "Please fill in a headline";
  if (!post.url)
    errors.url =  "Please fill in a URL";
  return errors;
}

//Regra para autorizar quem está logado a postar
// "this is a set of circumstances under which clients are allowed to do things to the Posts collection"
//Posts.allow({
  //clients are allowed to insert posts as long as they have a userId".
//  insert: function(userId, doc) {
    // only allow posting if you are logged in
//    return !! userId; //retorna o userId como um boleano, se for falso não vai deixar postar
    //userId é transformado em boleano no primeiro ! e depois é invertido para o seu estado normal
//  }
//});

Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });
    
    var errors = validatePost(postAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");
    
    
    //ver se tem urls duplicados
    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {//se encontrar algum post a variavel vai ser true e vai retornar que já existe
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }
   
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id, 
      author: user.username, 
      submitted: new Date()
    });
    var postId = Posts.insert(post);
    return {
      _id: postId
    };
  }
});