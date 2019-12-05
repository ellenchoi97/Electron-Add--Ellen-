//Initialize the zerorpc client
const zerorpc = require("zerorpc")
let client = new zerorpc.Client()
client.connect("tcp://127.0.0.1:4242")

//HTML elements needed to find and display sum
let error = document.querySelector('#error')
let leftInput = document.querySelector('#first_input')
let rightInput = document.querySelector('#second_input')
let answer = document.querySelector('#answer')
let sum = document.querySelector('#sum')

//When the sum button is clicked
sum.addEventListener('click', () => {
    console.log("Sum button clicked")

    //If there are less than two input values, display error message
    if (leftInput.value == "" || rightInput.value == "") {
        error.innerText = "Please input two numbers"
    }
    else {
        //Reset the error message
        error.innerText = ""

        //Call the Python add function from the child process
        client.invoke("add", leftInput.value, rightInput.value, (error, res) => {
            if (error) {
                console.error(error)
            }
            else {
                answer.value = res
            }
        })
    }
})