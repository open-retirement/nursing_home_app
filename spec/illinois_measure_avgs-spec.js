// spec/illinois_measure_avgs-spec.js
// var illinois_measure_avgs = require("../public/javascripts/illinois_measure_avgs");

describe("convert_points_to_stars", function(){
	it("800 points should return 5 (stars)", function(){
		var stars = calc_score(null, 40);
		expect(stars).toBe(5);
	});
	it("690 points should return 4 (stars)", function(){
		var stars = calc_score(null,12);
		expect(stars).toBe(4);
	});
})