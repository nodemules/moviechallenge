// ROUTES FOR WEBPAGE
// ===========================================================================

	exports.challenge = function(req, res) {
      res.render('challenge',
      { title : 'Challenge' }
      )
	};

    exports.page = function (req, res) {
      res.render('page')

    };
    
    exports.layout = function (req, res) {
      res.render('layout',
      { title : 'Home' }
      )
    };

    exports.index = function (req, res) {
      res.render('index')
    };

    exports.partials = function (req, res) {
      var name = req.params.name;
      res.render('partials/' + name)
    }