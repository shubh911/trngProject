app.config(function($routeProvider) {
$routeProvider
	.when("/",{
		templateUrl:"viewList.html"//by default this should be loaded
	})							   //Rest all are on the clicks
	.when("/addBook",{
		templateUrl:"addBook.html"
	})
	.when("/addAuthor",{
		templateUrl:"addAuthor.html"
	});
});	
