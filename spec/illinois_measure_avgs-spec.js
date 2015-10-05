// spec/illinois_measure_avgs-spec.js
var illinois_measure_avgs = require("../public/javascripts/illinois_measure_avgs");

describe("convert percentage to score based on measure code", function(){
	it("code 425, perc 60% should return a score of 75", function(){
		var score = illinois_measure_avgs.calc_score( 60, 425);
		expect(score).toBe(75);
	});
	it("code 409, perc 100% should return a score of 60", function(){
		var score = illinois_measure_avgs.calc_score(100, 409);
		expect(score).toBe(60);
	});
	it("code 410, perc 20% should return a score of 18", function(){
		var score = illinois_measure_avgs.calc_score( 18, 410);
		expect(score).toBe(20);
	});
	it("code 410, perc 20.1% should return a score of 40", function(){
		var score = illinois_measure_avgs.calc_score( 20.1, 410);
		expect(score).toBe(40);
	});
	it("code 410, perc 50% should return a score of 60", function(){
		var score = illinois_measure_avgs.calc_score( 50, 410);
		expect(score).toBe(60);
	});
	it("code 410, perc 71% should return a score of 80", function(){
		var score = illinois_measure_avgs.calc_score( 71, 410);
		expect(score).toBe(80);
	});
	it("code 410, perc 81% should return a score of 100", function(){
		var score = illinois_measure_avgs.calc_score( 81, 410);
		expect(score).toBe(100);
	});
	it("code 410, perc 100% should return a score of 100", function(){
		var score = illinois_measure_avgs.calc_score( 100, 410);
		expect(score).toBe(100);
	});
	it("code 434, perc 2% should return a score of 100", function(){
		var score = illinois_measure_avgs.calc_score( 2, 434);
		expect(score).toBe(100);
	});
	it("code 434, perc 40% should return a score of 80", function(){
		var score = illinois_measure_avgs.calc_score( 40, 434);
		expect(score).toBe(80);
	});
	it("code 434, perc 40.1% should return a score of 60", function(){
		var score = illinois_measure_avgs.calc_score( 40.1, 434);
		expect(score).toBe(60);
	});
	it("code 434, perc 79% should return a score of 40", function(){
		var score = illinois_measure_avgs.calc_score( 79, 434);
		expect(score).toBe(40);
	});
	it("code 434, perc 81% should return a score of 20", function(){
		var score = illinois_measure_avgs.calc_score( 81, 434);
		expect(score).toBe(20);
	});
	it("code 434, perc 100% should return a score of 20", function(){
		var score = illinois_measure_avgs.calc_score( 100, 434);
		expect(score).toBe(20);
	});
})