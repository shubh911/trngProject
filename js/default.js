var app=angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
	/*"/" is for default load when the index loads*/
	$routeProvider
	.when("/", {
        templateUrl : "views/viewList.html"
    })
	.when("/addBook",{
		templateUrl:"views/addBook.html"
	})
	.when("/addAuthor",{
		templateUrl:"views/addAuthor.html"
	})
	.when("/reset",{						/*This is supposed to redirect the page after*/
		templateUrl:"views/viewList.html"	/*the uploading and saving of the data is done*/
	})
	.when("/updateBook", {
        templateUrl : "views/updateBook.html"
    })
	.when("/updateAuthor", {
        templateUrl : "views/updateAuthor.html"
    })
});	

app.run(function($http,$rootScope){
	$http.get("http://localhost:8888")
	.then(function(response){/*$q -->promise can be used later if you have time*/
	//data contains both Books + Authors	
	$rootScope.data = response.data.library;
	/*use .get & .then because it some how acess the scope */
	/*Then hte data can be pushed at $scope so we can use it in other methods and services*/
	/*$rootscope can be useful for the differnt controllers but let see with scope first.*/
	console.log("weafgaed", $rootScope.data);
	/*data is reaching upto here but without a the proper array name */
	});	
});

app.service('mainService', function($rootScope){
	this.getBook = function(id)
	{
		return $rootScope.data.Books[id];
	}
	this.addBook = function(temp){
		$rootScope.data.Books.push(temp);
	}
	this.addAuthor = function(temp){
		$rootScope.data.Authors.push(temp);
	}
	this.editStudent = function(temp){
		students[data.id] = temp;	
	}
});

/*creating service is giving an missing semicolon ; error*/
/*unable to resolve that error until now cause i dont under-stand it(idiot).*/
/* app.service("addService",function($rootScope){
	this.addBook(){
		/*Take the data from the maincontroller and the push it to the global array*/
		
		/*Still working on the problem to push array on the json file*/
/* 		$rootScope.data.Books.push(tempBookData);
	};
	this.addAuthor(){
		$rootScope.data.Authors.push(tempAuthorData);
	};
	
}); */
app.controller("mainCtrl",function($scope, $http,$rootScope,$location,mainService)
{
		/*just taking data from the form by $scope ng-model and then creating the object and
		pushing it to the $rootScope*/
	$scope.addBookFunction=function(){
		var tempBookData={
			  ISBN: $scope.isbn,
			  BookTitle: $scope.bookTitle,
			  AuthorName: $scope.bookAuthor, 
			  authorId: 0,//not useful so far maybe after some time
			  price: $scope.bookPrice,
			  availableOn: $scope.availableOn
			}
			//This has to be done using service
		//$rootScope.data.Books.push(tempBookData);
		mainService.addBook(tempBookData);
		console.log($rootScope.data.Books);
		$location.path('reset');/*to redirect the page after saving the data to home.*/
							  /*dont write # cause it will be encoded as %23 and then it dosent load the correct page cause your url is /%23something/*/
	};
	$scope.addAuthorFunction=function(){
		var tempAuthorData={
			Id: 0,//not useful so far maybe after some time
			AuthorName:$scope.authorName, 
			Email:$scope.email,
			Department: $scope.department,
			Website: $scope.website,
			Skills: $scope.skills,
			DisplayPicture: "img/authors/0.jpg"//don't know what to do with it
			}
			//This has to be done using service
		//$rootScope.data.Authors.push(tempAuthorData);	
		mainService.addAuthor(tempAuthorData);
		$location.path('reset');/*to redirect the page after saving the data to home.*/
							  /*dont write # cause it will be encoded as %23 and then it dosent load the correct page cause your url is /%23something/*/
		};
		
	$scope.fetchBookDetail=function(event){
		var id=event.srcElement.id;
		var bookDisplay = mainService.getBook(id);/*THis is to get data from service to*/ 											/*display it in the updateBook page*/
		console.log(bookDisplay);
		$scope.ISBNTemp = bookDisplay.ISBN;
		$scope.BookTitleTemp = bookDisplay.BookTitle;
		$scope.AuthorNameTemp = bookDisplay.AuthorName;
		$scope.authorIdTemp = bookDisplay.authorId;
		$scope.priceTemp = bookDisplay.price;
		$scope.availableOnTemp = bookDisplay.availableOn;
	};
		$scope.fetchAuthorDetail=function(event){
		var id=event.srcElement.id;
		var bookDisplay = mainService.getAuthor(id);/*THis is to get data from service to*/ 											/*display it in the updateAuthor page*/
		console.log(bookDisplay);
		$scope.ISBNTemp = bookDisplay.ISBN;
		$scope.BookTitleTemp = bookDisplay.BookTitle;
		$scope.AuthorNameTemp = bookDisplay.AuthorName;
		$scope.authorIdTemp = bookDisplay.authorId;
		$scope.priceTemp = bookDisplay.price;
		$scope.availableOnTemp = bookDisplay.availableOn;
	};
});