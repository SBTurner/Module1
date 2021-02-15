// Create our own Hashing function to encrypt msg.

const msg = "Lets meet at midnight under the c1ock";
const tokens = msg.split("") //split into individual characters
let chunks = []; 
let slice = 0
const chunkSize = 8; //choose number of array items to be in a chunk

//Step 1. Chunking
while (slice < tokens.length) {
    chunks.push(tokens.slice(slice, slice += chunkSize));
}

//Step 2. Padding - so all chunks contain the same number of items
while (chunks[chunks.length - 1].length < chunkSize) {
    chunks[chunks.length - 1].push("a")
}

chunks = chunks.map(chunk => chunk.map(char => char.charCodeAt()))

//Step 3. Hashing - function to alter the original chunks
const hashChunks = () => {
    const state = [15, 24, 81, 90, 38]
    chunks.forEach(chunk => {
        state[0] = ((chunk[0]<<5)-state[3])
        state[1] = state[4]
        state[2] = chunk[1]*2
        state[3] = chunk.reduce((memo, b) => memo + b, state[3])
        state[4] = chunk[0] -1
    })
    return state.join("")
}

const hash = hashChunks(chunks)
console.log(hash)
