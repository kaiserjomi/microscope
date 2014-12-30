//Vai á coleção Posts e retorna todos que tem lá
Template.postsList.helpers({
  posts: function() {
    return Posts.find({}, {sort: {submitted: -1}});//fas o sort dos posts por data
  }
});