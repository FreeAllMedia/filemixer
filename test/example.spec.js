describe("Example Spec", () => {
	let value;

	beforeEach(() => {
		value = 3;
	});

	it("should be true", () => {
		value.should.eql(3);
	});

	it("should be false", () => {
		(value === 2).should.be.false;
	});
})
