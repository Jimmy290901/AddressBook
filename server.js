const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("addressbook.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const addrbook = grpcObject.addrbook;

//Constructs a server object to facilitate requests
const server = new grpc.Server();

//Add Service to server with a corresponding implementation
server.addService(addrbook.AddressBook.service, {
    AddPerson: AddPerson,
    ReadAddrBook: ReadAddrBook
});

//Bind the server to given port asynchronously  (insecure connection provided)
server.bindAsync("0.0.0.0:4000", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.log(err);
    } else {
        //Start the server and begin handling requests
        server.start();
        console.log("Server running on port " + port);
    }
});

const people_list = [];

//Implementation of service methods specified in the .proto file
function AddPerson(call, callback) {
    let msg = "";
    try {
        people_list.push(call.request);
        msg = "Person added successfully";
    } catch (err) {
        msg = err;
    } finally {
        callback(null, msg);
        console.log(msg, people_list);
    }
}

function ReadAddrBook(call) {
    try {
        for (let i = 0; i < people_list.length; i++) {
            call.write(people_list[i]);
        }
        call.end();
    } catch (err) {
        call.write(err);
    }
}
