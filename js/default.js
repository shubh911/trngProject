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
	this.getBook = function(isbn)
	{
		for(let i;i<$rootScope.data.Books.length;i++){
			if($rootScope.data.Books[i].ISBN===isbn){
				return $rootScope.data.Books[i];
			}
		}
	}
	this.getAuthor = function(id)
	{
		for(let i;i<$rootScope.data.Authors.length;i++){
			if($rootScope.data.Authors[i].AuthorName===id){
				return $rootScope.data.Authors[i];
			}
		}
	}	
	this.addBook = function(temp){/*This is to genrate the id automatically so that the we can can use it later
									but its etting comlicated cause i have to genrate local var and keep track of them
									hopefully the logic is complete and in  working order cause if not then lots o time 
									gonna get wasted.*/
		var tempArray=$rootScope.data.Books;
		//take a temp arr to sort so the last element has the highest id
		tempArray=tempArray.sort(function(a,b){
			return a.ISBN - b.ISBN;
		});
		console.log("should be arranged-books",tempArray);
		//take the last element id and increment it and assign it to the new element
		var tempId=parseInt(tempArray[tempArray.length-1].ISBN);
		console.log("new ISBN",tempId);
		//last element has the highest id so increment it by one will make a new unique id.
		temp.ISBN=++tempId;
		$rootScope.data.Books.push(temp);
	}
	this.addAuthor = function(temp){
		
		var tempArray=$rootScope.data.Authors;
		//take a temp arr to sort so the last element has the highest id
		tempArray=tempArray.sort(function(a,b){
			return a.authorId - b.authorId;
		});
		console.log("should be arranged-authors",tempArray);
		//take the last element id and increment it and assign it to the new element
		var tempId=tempArray[tempArray.length-1].authorId;
		console.log(tempId);
		//last element has the highest id so increment it by one will make a new unique id.
		temp.authorId=++tempId;
		$rootScope.data.Authors.push(temp);
	}
	this.updatedBookSave=function(temp){
		for(let i;i<$rootScope.data.Books.length;i++)//Traverse and Push
		{
			if($rootScope.data.Books[i].ISBN===temp.ISBN)
			{
				$rootScope.data.Books[i]=temp;
			}
		}
	}
	this.updatedAuthorSave=function(temp){
		for(let i;i<$rootScope.data.Books.length;i++)//Traverse and Push
		{
			if($rootScope.data.Authors[i].authorId===temp.authorId)
			{
				$rootScope.data.Authors[i]=temp;
			}
		}
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
							  /*dont write # cause it will be encoded as %23 and then it 
							  dosent load the correct page cause your url is /%23something/*/
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
		mainService.addAuthor(tempAuthorData);
		$location.path('reset');/*to redirect the page after saving the data to home.*/
							  /*dont write # cause it will be encoded as %23 and then it dosent 
							  load the correct page cause your url is /%23something/*/
		};
		
	$scope.fetchBookDetail=function(event1){
			console.log(event1);
			var id = event1.target.id || event1.srcElement.id;
			console.log("bookISBN",id);
			var bookDisplay = mainService.getBook(id);/*THis is to get data from service to*/
			/*display it in the updateBook page*/
			console.log(bookDisplay);
			$rootScope.bookDisplayTemp.ISBN = bookDisplay.ISBN;
			$rootScope.bookDisplayTemp.BookTitle = bookDisplay.BookTitle;
			$rootScope.bookDisplayTemp.AuthorName = bookDisplay.AuthorName;
			$rootScope.bookDisplayTemp.authorId = bookDisplay.authorId;
			$rootScope.bookDisplayTemp.price = bookDisplay.price;
			$rootScope.bookDisplayTemp.availableOn = bookDisplay.availableOn;
	};
	$scope.fetchAuthorDetail=function(event1){
			console.log(event1);
			var e = event1.target.id || event1.srcElement.id;
			var id = e.id;
			
			var bookDisplay = mainService.getAuthor(id);/*THis is to get data from service to*/
			/*display it in the updateAuthor page*/
			console.log(bookDisplay);
			/*putting the data in $scope so we acess it into the edit pages and in the form fields*/
			/*problem is that we have only one controller and ng-view needs another ng-view*/
			/*maybe gonna need another controller*/
			$rootScope.authorDisplayTemp.AuthorName = bookDisplay.AuthorName;
			$rootScope.authorDisplayTemp.Email = bookDisplay.Email;
			$rootScope.authorDisplayTemp.Department = bookDisplay.Department;
			$rootScope.authorDisplayTemp.Website = bookDisplay.Website;
			$rootScope.authorDisplayTemp.Skills = bookDisplay.Skills;
			$rootScope.authorDisplayTemp.DisplayPicture = bookDisplay.DisplayPicture;
	};
	$scope.bookEditReturn=function(){
			/*Take The data from the edit Form and acesss The orignal index*/
			var tempBookData={};
			tempBookData.ISBN=$scope.returnIsbn;
			tempBookData.bookTitle=$scope.returnBookTitle;
			tempBookData.authorName=$scope.returnAuthorName;
			tempBookData.price=$scope.returnPrice;
			tempBookData.availableOn=$scope.returnAvailableOn;
			/*call The mainService to Replace The data of orignal Index */
			mainService.updatedBookSave(tempBookData);
			$location.path('reset');
	};
	$scope.authorEditReturn=function(){
			/*Take The data from the edit Form and acesss the orignal index*/
			var tempBookData={};
			tempBookData.authorName=$scope.returnAuthorName;
			tempBookData.email=$scope.returnEmail;
			tempBookData.department=$scope.returnDepartment;
			tempBookData.website=$scope.returnWebsite;
			tempBookData.skills=$scope.returnSkills;
			/*call The mainService to Replace The orignal Index */
			mainService.updatedAuthorSave(tempBookData);
			$location.path('reset');
	};
});