const app = require("./server"); // Link to your server file
const request = require("supertest"); // Supertest is 

describe("GET /", function () {
  it("responds with JSON", function (done) {
    request(app)
      .get("/airports")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200, done);
  }); 
  it("GET returns array of all airports (NO pagination)", function (done) {
    request(app)
      .get("/airports")
      .expect((res) => {
        expect(res.body.length).toBeGreaterThan(28000)
      })
      .expect(200)
      .end(done);
  }); 
  it("GET returns array of all airports (WITH pagination)", function (done) {
    request(app)
      .get("/airports?page=3&limit=10")
      .expect((res) => {
        expect(res.body.length).toEqual(10)
      })
      .expect(200)
      .end(done);
  }); 
  it("POST creates a new airport", function (done) {
    request(app)
      .post("/airports")
      .send({
          icao: "0001",
          iata: "",
          name: "Sarah Test",
          city: "TEST",
          state: "TEST",
          country: "US",
          elevation: 800,
          lat: 59.94919968,
          lon: -151.695999146,
          tz: "America/Anchorage"
      })
      .expect((res) => {
        expect(res.body.icao).toEqual("0001")
        expect(res.body.name).toEqual("Sarah Test")
      })
      .expect(201)
      .end(done);
  });
  it("GET returns the specified airport", function (done) {
    request(app)
      .get("/airports/0001")
      .expect((res) => {
        expect(res.body.icao).toEqual("0001")
        expect(res.body.name).toEqual("Sarah Test")
      })
      .expect(200)
      .end(done);
  });
  it("PUT updates the specified airport", function (done) {
    request(app)
      .put("/airports/0001")
      .send({
          icao: "0001",
          iata: "",
          name: "Sarah Test 2",
          city: "TEST",
          state: "TEST",
          country: "US",
          elevation: 800,
          lat: 59.94919968,
          lon: -151.695999146,
          tz: "America/Anchorage"
      })
      .expect((res) => {
        expect(res.body.icao).toEqual("0001")
        expect(res.body.name).toEqual("Sarah Test 2")
      })
      .expect(200)
      .end(done);
  });
  it("DELETE the specified airport", function (done) {
    request(app)
      .delete("/airports/0001")
      .expect((res) => {
        expect(res.text).toBe("The airport has now been deleleted")
      })
      .expect(200)
      .end(done);
  });
  it("GET the specified airport which has now been DELETED", function (done) {
    request(app)
      .get("/airports/0001")
      .expect((res) => {
        expect(res.text).toBe("Couldn't find airport with icao 0001")
      })
      .expect(200)
      .end(done);
  });
  it("GET an unfound path", function (done) {
    request(app)
      .get("/airportssss/0001")
      .expect(404)
      .end(done);
  });
  it("POST with non JSON format data", function (done) {
    request(app)
      .post("/airports")
      .send("I should fail because I am not a JSON object")
      .expect(400)
      .expect((res) => {
        expect(res.text).toBe("Nice try... send in JSON format instead")
      })
      .end(done);
  })
});
