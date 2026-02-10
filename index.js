import express from "express";


import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());

const EMAIL = process.env.OFFICIAL_EMAIL;

// all the functions 


        function errorResponse(res, status, message) {
        return res.status(status).json({
            is_success: false,
            official_email: EMAIL,
            error: message
        });
        }




                            function gcd(a, b) {
                            while (b !== 0) {
                                [a, b] = [b, a % b];
                            }
                            return Math.abs(a);
                            }


        function lcm(a, b) {
        if (a === 0 || b === 0) return 0;
        return Math.abs(a * b) / gcd(a, b);
        }

// This is the health -- GET/HEATH ENPOINT......

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

// THIS IS THE POST / bfhl enpoint which iss suppsoed to handle the keys........
 



app.post("/bfhl", async (req, res) => {
  try {
               const keys =   Object.keys(req.body);

    //ye hai 1 key...
            if (keys.length !== 1) {
            return errorResponse(res, 400, "Exactly one input is required");
            }

    const key =   keys[0];
    const value = req.body[key];

            let data;


    switch (key) {

      case "fibonacci":
                        if (!Number.isInteger(value) || value < 0) {
                    return errorResponse(res, 400, "Invalid fibonacci input");
                    }


        if (value === 0) {
          data = [];
          break;
        }


        data = [];


        
        for (let i = 0; i < value; i++) {
                        if (i === 0) data.push(0);
                        else if (i === 1) data.push(1);
                        else data.push(data[i - 1] + data[i - 2]);
        }
        break;




      case "prime":
                    if (!Array.isArray(value)) {
                    return errorResponse(res, 400, "Prime input must be an array");
                    }
        data = value.filter(n => {



          if (!Number.isInteger(n) || n < 2) return false;



          for (let i = 2; i * i <= n; i++) {
            if (n % i === 0) return false;
          }



          return true;
        });


        data = [...new Set(data)];
        break;



      case "lcm":
                if (!Array.isArray(value) || value.length === 0) {
                return errorResponse(res, 400, "LCM input must be non empty....");
                }

                if (!value.every(n => Number.isInteger(n))) {
                return errorResponse(res, 400, "All values must be integers");
                }

             data = value.reduce((acc, n) => lcm(acc, n));
        break;



      case "hcf":
                if (!Array.isArray(value) || value.length === 0) {
                return errorResponse(res, 400, "HCF input must be a non empty array.../..");
                }

                if (!value.every(n => Number.isInteger(n))) {
                return errorResponse(res, 400, "All values must be integers");
                }

         data = value.reduce((acc, n) => gcd(acc, n));
         break;


        
      case "AI":
                        if (typeof value !== "string" || value.trim() === "") {
                            return errorResponse(res, 400, "AI input must be a string");
                        }


  const aiRes = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: `Answer the following question in EXACTLY ONE WORD.
Do not add punctuation.
Do not add explanation.
If unsure, still respond with one word only.

Question: ${value}`
            }
          ]
        }
      ]
    }
  );

  let raw =
    aiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "Unknown";

  data = raw
    .trim()
    .split(/\s+/)[0]
    .replace(/[^A-Za-z0-9]/g, "");

  break;

            default:
                return errorResponse(res, 400, "Unsupported key");
    }




        return res.status(200).json({
        is_success: true,
        official_email: EMAIL,
        data
        });


  } catch (err) {
    console.log("Requeset not processing..error:  ", err.message);
    return errorResponse(res, 500, "There is problem in server");
  }
});

// now we are done...we are starting the server...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});
