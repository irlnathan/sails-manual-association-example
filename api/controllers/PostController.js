/**
 * PostController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {


	index: function(req, res) {

		// [1] Grab all of the posts
		Post.find().exec(function(err, posts) {  

			

			// [2] remove posts where ownedBy is not defined -- NOTE: _remove mutates the array
			_.remove(posts, function(post) {
			
				/**
					[2a] Check to see if the instance of the models have an ownedBy attribute, 
					an ownedBy attribute === "" (in the case of bootstrapped data,
					ownedBy attribute === null (in the case of SQL adapters)
					owned by attribute === undefined (in the case of non-SQL adapter)
				*/	
				return !post.hasOwnProperty('ownedBy') || post.ownedBy === "" || post.ownedBy === null || post.ownedBy === undefined;

			});

			// [3] create an array of user ids by "plucking them out of the ownedBy attribute of posts".
			var user_ids= _.pluck(posts, 'ownedBy');


			// [4] Find the users whose ids are found in ownedBy
			User.find({id: user_ids}).exec(function(err, users) {

				// [4a] grab all of my posts
				var results = _.map(posts, function(post) {

					/**
					 	[4b] within each post find the user object whose "user.id" is equal to "post.ownedBy" (which
				 		is an id of the user at first) and then assign the user object to post.ownedBy.  So the user
				 		with the id of 1 will look like {post.ownedBy: 1}  BEFORE and then:

				 		 	post.ownedBy: {
								name: "Brennan",
								company: "Auctor Ltd",
								email: "nec.urna.et@turpisNullaaliquet.net",
								createdAt: "2014-04-23T22:33:05.842Z",
								updatedAt: "2014-04-23T22:33:05.842Z",
								id: 1
							}
					*/
  					post.ownedBy = _.find(users, function (user) {
  					return user.id == post.ownedBy;
					});
				});

			});

					res.view({posts: posts});

		});


	}
	
};


