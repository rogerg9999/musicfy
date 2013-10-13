angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 100;

            if (end === undefined)
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });

var app = angular.module('music', ['ui.bootstrap', 'angular-audio-player', 'filters', 'ui.sortable']);

app.config(function($routeProvider, $locationProvider){
    
    
    $routeProvider.
    when('/search/:query', {controller: SearchCtrl, templateUrl: '/partials/search'}).
    when('/', {controller: HomeCtrl, templateUrl:'/partials/index'}).
    otherwise({redirectTo: '/'});
   $locationProvider.hashPrefix('!');
    //$locationProvider.html5Mode(true);
});


app.run(function($rootScope) {
    /*
        Receive emitted message and broadcast it.
        Event names must be distinct or browser will blow up!
    */
    $rootScope.$on('add', function(event, args) {
        $rootScope.$broadcast('addToPlaylist', args);
    });
    
    $rootScope.$on('play', function(event, args){
       $rootScope.$broadcast('playData', args); 
    });
});


function HomeCtrl($scope, $location){
   $scope.query = ""; 
   $scope.playlist = [];
   $scope.doSearch = function(){
     $location.path('/search/'+$scope.query);  
   };
   
    $scope.removeFromPlaylist = function(index){
        console.log("remove "+index);
        if(index > -1 && $scope.playlist.length > 0)
            $scope.playlist.splice(index, 1);
    };

  $scope.$on('addToPlaylist', function(event, args) {
    $scope.playlist.push(args);
    
  }); 
  
  $scope.$on('playData', function(event, args){
     $scope.playlist = [args]; 
  });
  
   }

function SearchCtrl($scope, $http, $location, $routeParams){
   $scope.playlist = [];
    $scope.addToPlaylist = function(data){
        var args = { src: data.href, type: 'audio/mpeg', title: data.title };
       $scope.$emit('add', args);
    };
    
    $scope.play = function(data){
        var args = { src: data.href, type: 'audio/mpeg', title: data.title };
        $scope.$emit('play', args);
    };


      $http.get("/api/search/"+$routeParams.query)
         .success(function(data, status, headers, config){
            if(status === 200 && data && data.response){
                var results = JSON.parse(data.response);
                $scope.results = results;
            }
    });  
}





