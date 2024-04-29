const express = require("express");
const cors = require('cors');

const path = require("path");
const jwt = require("jsonwebtoken");
const mySecretToken = "ssfgr2-rtbbwe477-asd133ghuy-g5a23fghuv467i-tyabfw344jk5";
const { v4: uuidv4 } = require('uuid')

const nodemailer = require("nodemailer");

const compiler = require("compilex");
const options = { stats: true }
compiler.init(options)

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { json } = require("body-parser");
const app = express();
const multer = require('multer');
const { connect } = require("http2");
const upload = multer();
app.use(express.urlencoded({ extended: true }));
const fs = require('fs');


const dbPath = path.join(__dirname, "lt.db");

let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3003, () => {
            console.log("Server Running at http://localhost:3003/");
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();

app.use(cors());
app.use(express.json());

app.post("/signup", async (request, response) => {
    const { email } = request.body;
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cslt@rguktrkv.ac.in',
            pass: 'zsxi olje sgng xask'
        }
    });
    const code = Math.floor(Math.random() * 1000000);
    var mailOptions = {
        from: 'cslt@rguktrkv.ac.in',
        to: email,
        subject: 'Your verification code for LT club',
        html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 30px; border: 1px solid #ddd; border-radius: 5px; color: #333;">
      <header style="margin-bottom: 20px;">
        <h2 style="color: #333;">Dear Learner,</h2>
      </header>
      <section style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        <p style="margin-bottom: 15px;">Your Verification Code is: <strong style="color: #35972d;">${code}</strong>.<br/>Please use this code to access our LT club activities.<br/><br/>Thank you for being part of our LT community!</p>
      </section>
      <footer style="text-align: center; margin-top: 20px;">
        <p style="font-size: 14px; color: #777;">Best regards,<br>Your Learn Together Team</p>
      </footer>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            response.status(200);
            response.send(JSON.stringify(code));
        }
    });

})

app.post("/verify", async (request, response) => {
    const { email } = request.body;

    const id = email.split('@')[0];

    const selectUserQuery = `select * from user_details where id = ${JSON.stringify(id)}`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
        const createUserQuery = `insert into user_details values(${JSON.stringify(id)}, ${JSON.stringify(email)}, ${3})`;
        await db.run(createUserQuery);
    }
    const payload = {
        id: id,
    };
    const jwtToken = jwt.sign(payload, mySecretToken);

    const getUserQue = `select tier from user_details where id = ${JSON.stringify(id)}`;
    const result = await db.get(getUserQue);
    const tier = result['tier'];
    response.send(JSON.stringify({ jwtToken, tier, id }));

})

app.post("/compile", (req, res) => {
    var code = req.body.code
    var input = req.body.input
    var lang = req.body.lang

    const stats = fs.readdirSync('./temp');
    if (stats.length > 212){
        fs.rmSync('./temp', { recursive: true, force: true });
        fs.mkdir('./temp', () => {
            console.log("new temp created!!")
        })
    }

    try {

        if (lang == "cpp") {
            if (!input) {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; // (uses g++ command to compile )
                compiler.compileCPP(envData, code, function (data) {
                    if (data) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
            else {
                var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }; // (uses g++ command to compile )
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
        }
        else if (lang == "java") {
            if (!input) {
                var envData = { OS: "windows" };
                compiler.compileJava(envData, code, function (data) {
                    if (data) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                })
            }
            else {
                //if windows  
                var envData = { OS: "windows" };
                //else
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    if (data.output) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                })
            }
        }
        else if (lang == "python") {
            if (!input) {
                var envData = { OS: "windows" };
                compiler.compilePython(envData, code, function (data) {
                    if (data) {
                        res.send(data)
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
            else {
                var envData = { OS: "windows" };
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    if (data) {
                        res.send(data);
                    }
                    else {
                        res.send({ output: "error" })
                    }
                });
            }
        }
    }
    catch (e) {
        console.log("error")
    }

})

app.post("/upload-mcq", upload.array("images"), async (req, res) => {
    try {
        const { json_data } = req.body
        const imageData = req.files
        const { testName, desc, time, mcq } = JSON.parse(json_data)
        const { min, sec } = time
        const test_id = uuidv4()
        const query_1 = `insert into test_details values(${JSON.stringify(test_id)}, "mcq", ${JSON.stringify(testName)}, ${JSON.stringify(desc)}, ${parseInt(min)}, ${parseInt(sec)})`
        await db.run(query_1)
        for (let i = 0; i < mcq.length; i++) {
            const q_id = uuidv4()
            const q_obj = mcq[i]
            const query_2 = `insert into mcqs values(${JSON.stringify(q_id)}, ${q_obj.qNo}, ${JSON.stringify(q_obj.question)}, ${q_obj.optCount}, ${q_obj.crtOpt}, ?, ${JSON.stringify(test_id)})`
            await db.run(query_2, imageData[i] !== undefined ? [imageData[i].buffer] : null)
            for (let j = 0; j < q_obj.optCount; j++) {
                const o_id = uuidv4()
                const option = q_obj.options[j]
                const query_3 = `insert into options values(${JSON.stringify(o_id)}, ${JSON.stringify(option)}, ${JSON.stringify(q_id)})`
                await db.run(query_3)
            }
        }
        res.send(JSON.stringify("Test added successfully!"))
    } catch (error) {
        res.status(400)
    }
})

app.post("/update-subtopic", upload.array("images"), async (req, res) => {
    try {
        const { json_data, st_id, del_data } = req.body
        const st_details = JSON.parse(json_data).otherData
        const imageData = req.files
        let img_index = 0
        const del_array = JSON.parse(del_data).delStDetails
        for (let d = 0; d < del_array.length; d++) {
            const e = del_array[d]
            let del_f = `delete from sub_topic_fields where f_id = ?`
            await db.run(del_f, e.f_id)

            if (e.id === "title") {
                let del_q = `delete from sub_topic_titles where f_id = ?`
                await db.run(del_q, e.f_id)
            } else if (e.id === "desc") {
                let del_q = `delete from sub_topic_descriptions where f_id = ?`
                await db.run(del_q, e.f_id)
            } else if (e.id === "code") {
                let del_q = `delete from sub_topic_codes where f_id = ?`
                await db.run(del_q, e.f_id)
            } else {
                let del_q = `delete from sub_topic_imgs where f_id = ?`
                await db.run(del_q, e.f_id)
            }
        }
        for (let i = 0; i < st_details.length; i++) {
            const element = st_details[i]
            if (element.id === "title") {
                if (element.f_id === undefined) {
                    const f_id = uuidv4()
                    let stf_q = `insert into sub_topic_fields values(?, ?, ?)`
                    await db.run(stf_q, st_id, f_id, element.id)
                    let stt_q = `insert into sub_topic_titles values(?, ?, ?)`
                    await db.run(stt_q, f_id, element.id, element.value)
                } else if (element.changed !== undefined) {
                    let up_q = `update sub_topic_titles set value = ? where f_id = ?`
                    await db.run(up_q, element.value, element.f_id)
                }
            } else if (element.id === "desc") {
                if (element.f_id === undefined) {
                    const f_id = uuidv4()
                    let stf_q = `insert into sub_topic_fields values(?, ?, ?)`
                    await db.run(stf_q, st_id, f_id, element.id)
                    let std_q = `insert into sub_topic_descriptions values(?, ?, ?)`
                    await db.run(std_q, f_id, element.id, element.value)
                } else if (element.changed !== undefined) {
                    let up_q = `update sub_topic_descriptions set value = ? where f_id = ?`
                    await db.run(up_q, element.value, element.f_id)
                }
            } else if (element.id === "code") {
                if (element.f_id === undefined) {
                    const f_id = uuidv4()
                    let stf_q = `insert into sub_topic_fields values(?, ?, ?)`
                    await db.run(stf_q, st_id, f_id, element.id)
                    let stc_q = `insert into sub_topic_codes values(?, ?, ?, ?)`
                    await db.run(stc_q, f_id, element.id, element.lang, element.value)
                } else if (element.changed !== undefined) {
                    let up_q = `update sub_topic_codes set value = ?, lang = ? where f_id = ?`
                    await db.run(up_q, element.value, element.lang, element.f_id)
                }
            } else {
                if (element.f_id === undefined) {
                    const f_id = uuidv4()
                    let stf_q = `insert into sub_topic_fields values(?, ?, ?)`
                    await db.run(stf_q, st_id, f_id, element.id)
                    let sti_q = `insert into sub_topic_imgs values(?, ?, ?)`
                    await db.run(sti_q, f_id, element.id, imageData[img_index].buffer)
                } else if (element.changed !== undefined) {
                    let up_q = `update sub_topic_imgs set value = ? where f_id = ?`
                    await db.run(up_q, imageData[img_index].buffer, element.f_id)
                }
                img_index++
            }
        }
        res.send(JSON.stringify("Test added successfully!"))
    } catch (error) {
        res.status(400)
        console.log(error)
    }
})

app.post("/upload-track", upload.single("image"), async (req, res) => {
    try {
        const { json_data } = req.body
        const track_details = JSON.parse(json_data).track_details
        const { title, description } = track_details
        if (track_details.id === undefined) {
            const imageData = req.file.buffer
            const track_id = uuidv4()
            const query_1 = `insert into track_details values(?, ?, ?, ?)`
            await db.run(query_1, track_id, title, description, imageData)
            res.send(JSON.stringify("Track added successfully!"))
        } else {
            if (track_details.imgChanged !== undefined) {
                const imageData = req.file.buffer
                let img_up_q = `update track_details set image = ? where id = ?`
                await db.run(img_up_q, imageData, track_details.id)
            }
            let up_q = `update track_details set title = ?, description = ? where id = ?`
            await db.run(up_q, title, description, track_details.id)
            res.send(JSON.stringify("Track updated successfully!"))
        }

    } catch (error) {
        console.log(error)
        res.status(400)
    }
})

app.post("/get-tier", async (req, res) => {
    const {token} = req.body
    const decoded = jwt.verify(token, mySecretToken);
    const tier_query = `select tier from user_details where id = ?`
    try {
        const tier = await db.get(tier_query, decoded.id)
        res.send(tier)
    } catch (error) {
        console.log(error)
        res.status(400)
    }
})

app.get("/get-details", async (req, res) => {
    const get_query = `select * from test_details`
    const get_tracks = `select * from track_details`
    const result = await db.all(get_query)
    const track_result = await db.all(get_tracks)

    res.send([result, track_result])
})

app.post("/get-test-details", async (req, res) => {
    const { test_id } = req.body
    const get_query = `select * from test_details where id = ${JSON.stringify(test_id)}`
    const result = await db.all(get_query)

    res.send(JSON.stringify(result))
})

app.post("/upload-cq", async (req, res) => {
    try {
        const { testName, testDesc, time, cq } = req.body
        const { min, sec } = time
        const test_id = uuidv4()
        const query_1 = `insert into test_details values(${JSON.stringify(test_id)}, "coding", ${JSON.stringify(testName)}, ${JSON.stringify(testDesc)}, ${parseInt(min)}, ${parseInt(sec)})`
        await db.run(query_1)
        for (let i = 0; i < cq.length; i++) {
            const q_id = uuidv4()
            const q_obj = cq[i]
            const query_2 = `insert into cqs values(${JSON.stringify(q_id)}, ${q_obj.qNo}, ${JSON.stringify(q_obj.qHeading)}, ${JSON.stringify(q_obj.qDesc)}, ${JSON.stringify(`${q_obj.samples[0].in}~${q_obj.samples[0].out}`)}, ${JSON.stringify(`${q_obj.samples[0].in}~${q_obj.samples[0].out}`)}, ${JSON.stringify(q_obj.exp)}, ${JSON.stringify(q_obj.constrs)}, ${q_obj.tcaseCount}, ${JSON.stringify(test_id)})`
            await db.run(query_2)
            for (let j = 0; j < q_obj.tcaseCount; j++) {
                const tc_id = uuidv4()
                const tcase = q_obj.tcases[j]
                const query_3 = `insert into tcases values(${JSON.stringify(tc_id)},${JSON.stringify(`${tcase.in}~${tcase.out}`)}, ${JSON.stringify(q_id)})`
                await db.run(query_3)
            }
        }
        res.send(JSON.stringify("Test added successfully!"))
    } catch (error) {
        res.status(400)
        res.send(error.message)
    }
})

app.post("/get-coding-question-details", async (req, res) => {
    const { test_id } = req.body
    const get_query = `select * from cqs where test_id = ${JSON.stringify(test_id)}`
    const result = await db.all(get_query)

    res.send(JSON.stringify(result))
})

app.post("/get-testcases", async (req, res) => {
    try {
        const { q_id } = req.body
        const get_query = `select * from tcases where q_id = ${JSON.stringify(q_id)}`
        const result = await db.all(get_query)
        console.log(q_id)

        res.send(JSON.stringify(result))
    }
    catch (e) {
        console.log(e.message)
    }
})

app.post("/submit-coding-test", async (req, res) => {
    const id = uuidv4()
    const { st_id, test_id, q_id, code } = req.body
    in_query = `insert into code_subs values(${JSON.stringify(id)}, ${JSON.stringify(st_id)}, ${JSON.stringify(test_id)}, ${JSON.stringify(q_id)}, ${JSON.stringify(code)})`
    try {
        await db.run(in_query)
        res.send(JSON.stringify("Test Submitted Successfully!!"))
    } catch (error) {
        res.status(400)
        res.send(JSON.stringify(error.message))
    }
})

app.post("/get-stopic-id", async (req, res) => {
    const { track_id } = req.body
    let q = `select * from topic_details where track_id = ${JSON.stringify(track_id)}`
    try {
        const result = await db.get(q)
        if (result !== undefined) {
            const sq = `select * from subtopic_details where topic_id = ${JSON.stringify(result.id)}`
            const stopic = await db.get(sq)
            if (stopic !== undefined) {
                res.send(stopic)
            } else {
                res.status(400)
                res.send(JSON.stringify("create"))
            }
        } else {
            res.status(400)
            res.send(JSON.stringify("create"))
        }

    } catch (error) {
        res.status(400)
    }
})

app.post("/get-track-details", async (req, res) => {
    const { track_id } = req.body
    let q = `select * from track_details where id = ?`
    try {
        const result = await db.get(q, track_id)
        res.send(result)
    } catch (error) {
        res.status(400)
    }
})

app.post("/get-topic-details", async (req, res) => {
    const { track_id } = req.body
    let q = `select * from topic_details where track_id = ${JSON.stringify(track_id)}`
    try {
        const result = await db.all(q)
        const topics = []
        for (let i = 0; i < result.length; i++) {
            const topic = result[i]
            const sq = `select * from subtopic_details where topic_id = ${JSON.stringify(topic.id)}`
            const stopics = await db.all(sq)
            topics.push({ "id": topic.id, "title": topic.title, "subTopics": stopics })
        }
        res.send(topics)
    } catch (error) {
        res.status(400)
    }
})

app.post("/get-subtopic-details", async (req, res) => {
    const { st_id } = req.body
    try {
        let q = `select * from sub_topic_fields where st_id = ?`
        const result = await db.all(q, st_id)
        let subtopicDetails = []
        for (let i = 0; i < result.length; i++) {
            const element = result[i]
            if (element.id === "title") {
                let stt_q = `select * from sub_topic_titles where f_id = ?`
                const title = await db.get(stt_q, element.f_id)
                subtopicDetails.push(title)
            } else if (element.id === "desc") {
                let std_q = `select * from sub_topic_descriptions where f_id = ?`
                const desc = await db.get(std_q, element.f_id)
                subtopicDetails.push(desc)
            } else if (element.id === "code") {
                let stc_q = `select * from sub_topic_codes where f_id = ?`
                const code = await db.get(stc_q, element.f_id)
                subtopicDetails.push(code)
            } else {
                let sti_q = `select * from sub_topic_imgs where f_id = ?`
                const img = await db.get(sti_q, element.f_id)
                subtopicDetails.push(img)
            }
        }
        res.send(subtopicDetails)
    } catch (error) {
        res.status(400)
        console.log(error)
    }
})

app.post("/add-new-topic", async (req, res) => {
    const id = uuidv4()
    const { track_id, title } = req.body

    let q = `insert into topic_details values(${JSON.stringify(id)}, ${JSON.stringify(title)}, ${JSON.stringify(track_id)});`

    try {
        await db.run(q)
        res.send(JSON.stringify("Success"))
    } catch (error) {
        res.status(400)
    }
})

app.post("/del-track", async (req, res) => {
    const { track_id } = req.body

    try {
        let tr_q = `delete from track_details where id = ?`
        await db.run(tr_q, track_id)
        let t_q = `select * from topic_details where track_id = ?`
        const topic_details = await db.all(t_q, track_id)
        for (let k = 0; k < topic_details.length; k++) {
            const topic = topic_details[k]
            let q = `delete from topic_details where id = ?`
            await db.run(q, topic.id)
            let st_q = `select * from subtopic_details where topic_id = ?`
            const st_details = db.all(st_q, topic.id)
            for (let j = 0; j < st_details.length; j++) {
                const element = st_details[j]
                let q = `delete from subtopic_details where id = ?`
                let f_q = `select * from sub_topic_fields where st_id = ?`
                const field_details = await db.all(f_q, element.id)
                for (let i = 0; i < field_details.length; i++) {
                    const e = field_details[i]
                    if (e.id === "title") {
                        let del_q = `delete from sub_topic_titles where f_id = ?`
                        await db.run(del_q, e.f_id)
                    } else if (e.id === "desc") {
                        let del_q = `delete from sub_topic_descriptions where f_id = ?`
                        await db.run(del_q, e.f_id)
                    } else if (e.id === "code") {
                        let del_q = `delete from sub_topic_codes where f_id = ?`
                        await db.run(del_q, e.f_id)
                    } else {
                        let del_q = `delete from sub_topic_imgs where f_id = ?`
                        await db.run(del_q, e.f_id)
                    }
                }
                let del_f = `delete from sub_topic_fields where st_id = ?`
                await db.run(del_f, element.id)
                await db.run(q, element.id)
            }
        }

        res.send(JSON.stringify("Success"))
    } catch (error) {
        res.status(400)
        console.log(error)
    }
})


app.post("/del-topic", async (req, res) => {
    const { topic_id } = req.body

    try {
        let q = `delete from topic_details where id = ?`
        await db.run(q, topic_id)
        let st_q = `select * from subtopic_details where topic_id = ?`
        const st_details = db.all(st_q, topic_id)
        for (let j = 0; j < st_details.length; j++) {
            const element = st_details[j]
            let q = `delete from subtopic_details where id = ?`
            let f_q = `select * from sub_topic_fields where st_id = ?`
            const field_details = await db.all(f_q, element.id)
            for (let i = 0; i < field_details.length; i++) {
                const e = field_details[i]
                if (e.id === "title") {
                    let del_q = `delete from sub_topic_titles where f_id = ?`
                    await db.run(del_q, e.f_id)
                } else if (e.id === "desc") {
                    let del_q = `delete from sub_topic_descriptions where f_id = ?`
                    await db.run(del_q, e.f_id)
                } else if (e.id === "code") {
                    let del_q = `delete from sub_topic_codes where f_id = ?`
                    await db.run(del_q, e.f_id)
                } else {
                    let del_q = `delete from sub_topic_imgs where f_id = ?`
                    await db.run(del_q, e.f_id)
                }
            }
            let del_f = `delete from sub_topic_fields where st_id = ?`
            await db.run(del_f, element.id)
            await db.run(q, element.id)
        }
        res.send(JSON.stringify("Success"))
    } catch (error) {
        res.status(400)
        console.log(error)
    }
})

app.post("/edit-topic", async (req, res) => {
    const { topic } = req.body
    const { id, title } = topic
    let q = `update topic_details set title = ${JSON.stringify(title)} where id = ${JSON.stringify(id)}`

    try {
        await db.run(q)
        res.send(JSON.stringify("Success"))
    } catch (error) {
        res.status(400)
        console.log(error)
    }

})

app.post("/add-new-stopic", async (req, res) => {
    const id = uuidv4()
    const { topic_id, title } = req.body

    let q = `insert into subtopic_details values(${JSON.stringify(id)}, ${JSON.stringify(title)}, ${JSON.stringify(topic_id)});`

    try {
        await db.run(q)
        res.send(JSON.stringify("Success"))
    } catch (error) {
        res.status(400)
    }
})

app.post("/del-stopic", async (req, res) => {
    const { stopic_id } = req.body
    try {
        let q = `delete from subtopic_details where id = ?`
        let f_q = `select * from sub_topic_fields where st_id = ?`
        const field_details = await db.all(f_q, stopic_id)
        for (let i = 0; i < field_details.length; i++) {
            const e = field_details[i]
            if (e.id === "title") {
                let del_q = `delete from sub_topic_titles where f_id = ?`
                await db.run(del_q, e.f_id)
            } else if (e.id === "desc") {
                let del_q = `delete from sub_topic_descriptions where f_id = ?`
                await db.run(del_q, e.f_id)
            } else if (e.id === "code") {
                let del_q = `delete from sub_topic_codes where f_id = ?`
                await db.run(del_q, e.f_id)
            } else {
                let del_q = `delete from sub_topic_imgs where f_id = ?`
                await db.run(del_q, e.f_id)
            }
        }
        let del_f = `delete from sub_topic_fields where st_id = ?`
        await db.run(del_f, stopic_id)
        await db.run(q, stopic_id)
        res.send(JSON.stringify("Success"))
    } catch (error) {
        res.status(400)
        console.log(error)
    }
})

app.post("/edit-stopic", async (req, res) => {
    const { stopic } = req.body
    const { id, title } = stopic
    let q = `update subtopic_details set title = ${JSON.stringify(title)} where id = ${JSON.stringify(id)}`

    try {
        await db.run(q)
        res.send(JSON.stringify("Success"))
    } catch (error) {
        res.status(400)
        console.log(error)
    }

})
