// ROUTES FOR WEBPAGE
// ===========================================================================

	exports.challenge = function(req, res) {
      res.render('challenge',
      { title : 'Challenge' }
      )
	};

    exports.lists = function (req, res) {
      res.render('lists')

    };
    
    exports.layout = function (req, res) {
      res.render('layout'
      )
    };

    exports.index = function (req, res) {
      res.render('index'),
      { title : 'Home' }
    };

    exports.partials = function (req, res) {
      var name = req.params.name;
      res.render('partials/' + name)
    }