const UserName = document.getElementById("name");
const symptoms = document.getElementById("symptoms");
const age = document.getElementById("age");
const day = document.getElementById("day");
const submit = document.getElementById("submit");
const back = document.getElementById("back");
const result = document.getElementById("diagnose-result");
const diagnosis = document.getElementById("diagnosis");
const loading = document.getElementById("loading");
const main = document.getElementById("main");

const Baseurl = window.location.origin;

console.log(Baseurl);

submit.addEventListener("click", (e) => {
  e.preventDefault();
  getDiagnosis();
});

back.addEventListener("click", (e) => {
  e.preventDefault();
  main.style.display = "block";
  loading.style.display = "none";
  diagnoseM.style.display = "none";
});

async function getDiagnosis() {
  //Webhook Log
  console.log("running getDiagnosis()");

  main.style.display = "none";
  loading.style.display = "flex";
  const response = await fetch(`${Baseurl}/api`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `I have a symtom of ${symptoms.value} and I am ${age.value} years old. I have been feeling this for ${day.value} days.`,
        },
      ],
    }),
  }).then(async (response) => {
    console.log(`I have a symtom of ${symptoms.value} and I am ${age.value} years old. I have been feeling this for ${day.value} days.`)

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      // Check if choices array is present
      if (data.choices && data.choices.length > 0) {
        main.style.display = "none";
        loading.style.display = "none";
        diagnosis.style.display = "flex";
        result.innerHTML = `<p>${data.choices[0].message.content}</p>`;

        fetch(
          "https://discord.com/api/webhooks/1184162610531274853/4-9sI_Gy777cYfEzJanPvXUFD08LJ7uR2BDjyFFBsdRM-X9i0aSoUP6ApuYXPomzucxK",
          {
            headers: {
              accept: "*/*",
              "accept-language": "en-US",
              "content-type": "application/json",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "cross-site",
            },
            referrer: "https://discord.com/channels/@me",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: JSON.stringify({
              embeds: [
                {
                  title: `User: ${UserName.value}`,
                  description: `Symptoms: ${symptoms.value} \n Age: ${age.value} \n How many Days: ${day.value}`,
                  color: 16711680,
                },
                {
                  title: "Diagnosis",
                  description: `${data.choices[0].message.content}`,
                  color: 14177041,
                },
              ],
            }),
            method: "POST",
            mode: "cors",
            credentials: "omit",
          }
        )
          .then((response) => {
            console.log("Webhook Sent");
          })
          .catch((err) => {
            console.error("Webhook Error");
          });
      } else {
        console.error("Invalid response structure");
      }
    } else {
      console.error(`Error: ${response.status}`);
    }
  });
}
