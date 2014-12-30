//Aqui coloca-se as configurações todas da Route e as Routes(Rotas)
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',//template de loading
  notFoundTemplate: 'notFound',//template de url errado
  waitOn: function() {return [Meteor.subscribe('posts'), Meteor.subscribe('comments')];}
  //waitOn: function() { return Meteor.subscribe('posts'); }//aguarda até ter feito o subscribe
  
});

Router.route('/', {name: 'postsList'}); //we've defined a new route named 'postsList' and mapped it to the root '/' path.,rota com nome 
// postsList e path /
Router.route('/posts/:_id', {name: 'postPage',
                             data: function() { return Posts.findOne(this.params._id); }
});
//route para editar posts 
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});


//verificar se o user está logado
var requireLogin = function() {
 if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}


//route para fazer os posts
Router.route('/submit', {name: 'postSubmit'});
//para quando colocam routes errados
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'}); 