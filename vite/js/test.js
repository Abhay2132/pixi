class Human {
	constructor(opt) {
		const { name = "Adam" } = opt || {};
		this.name = name;
	}

	print() {
		console.log(this.name);
	}
}

class Student extends Human {
	constructor(opt) {
		super(opt);
		this.name = "Mr. " + this.name;
	}
}

const Abhay = new Student({ name: "Abhay Bisht" });
Abhay.print();
