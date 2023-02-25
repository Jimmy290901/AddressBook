const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("addressbook.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const addrbook = grpcObject.addrbook;

/* 
Constructing a new stub, with which we would be able to call the 
remote serive procedures at server side.
 */
const stub = new addrbook.AddressBook("localhost:4000", grpc.credentials.createInsecure());

const newPerson = {
    name: "Shubham Jain",
    id: 1001,
    email: "abc@gmail.com",
    phones : [
        {
            number: "1234567890",
        }, {
            number: "1234567890",
            type: "WORK"
        }
    ]
}

stub.AddPerson(newPerson, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
});

let stream = stub.ReadAddrBook();
stream.on("data", (data)=> {
    console.log('=> ' + JSON.stringify(data));
});

stream.on("error", (err)=> {
    console.log(err);
});
stream.on("end", ()=> {
    console.log("Streaming finished.");
})