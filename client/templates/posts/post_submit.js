Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();//impede que avance por default

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };
    
    //validar o post se tem title e url inseridos
    var errors = validatePost(post);
    if (errors.title || errors.url)
      return Session.set('postSubmitErrors', errors);

    //post._id = Posts.insert(post);//devolve o id inserido na coleção
    //Router.go('postPage', post);//redireciona para a pagina do post criado
    Meteor.call('postInsert', post, function(error, result) {
      // display the error to the user and abort
      if (error)
        //return alert(error.reason);
        //return throwError(error.reason);
        //aleterou-se para o package
        return Errors.throw(error.reason);
      // show this result but route anyway
      if (result.postExists)
        //alert('This link has already been posted');
        //alterou-se para o package
        //throwError('This link has already been posted');
        Errors.throw('This link has already been posted');
      //Depois redireciona para a pagina do post criado
     Router.go('postPage', {_id: result._id});  
    });
  }
});


Template.postSubmit.created = function() {
  Session.set('postSubmitErrors', {});
}
//helper para retornar os erros do field (url ou title)
Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});

