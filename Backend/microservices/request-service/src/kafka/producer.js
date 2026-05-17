const connectProducer = async () => {
	console.log("Kafka producer stub: connectProducer() called — no-op");
};

const send = async (payload) => {
	console.log("Kafka producer stub send:", JSON.stringify(payload));
};

module.exports = {
	connectProducer,
	send
};
