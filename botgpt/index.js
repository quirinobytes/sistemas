const express = require("express")
require("dotenv").config()
const {Configuration, OpenAIApi} = require("openai")

const app = express()

app.use(express.json())

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
})

const openai = new OpenAIApi(configuration)

app.get("/", async (req,res) => {
    try {
        const prompt = req.body
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ` const example = (arr) => {
                arr.map((item) => {
                    console.log(item2);
                });
            }           
            The complexity of this fuction is
            ###
            `,
            max_tokens: 64,
            temperature: 0,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            stop: ["\n"],
        })
        return res.json({
            success: true,
            data: response.data.choices[0].text,
        })
    } 
    catch (error){
        return res.status(400).json({
            success: false,
            error: error.response
              ? error.response.data
              : "Existe um erro no servidor",
        })

    }
})


const port = process.env.PORT || 2000
app.listen(port, () => console.log(`Server listening on port ${port} `))

