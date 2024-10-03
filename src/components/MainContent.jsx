import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import { Stack } from "@mui/material";
import PrayerCards from "./PrayerCards";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import asr from "./../assets/Asrg.jpg";
import duhr from "./../assets/Duhrr.jfif";
import fjr from "./../assets/Fajr.jfif";
import magrip from "./../assets/Maggrib.jfif";
import isha from "./../assets/Isha.jfif";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";

const MainContent = () => {
  const [timings, setTimings] = useState("");
  const [selectedCity , setSelectedCity] = useState({
    displayName : "القاهرة",apiName:"Cairo" , countryIso :"EG"
  })
  const [time , setTime]=useState("")
  const [nextPrayerIndex , setNextPrayerIndex] = useState(0)
  const [remainingTime, setRemainingTime] = useState("");
  
  const displayPrayes =[{
    key : "Fajr",displayName:"الفجر"
  },{
    key : "Dhuhr",displayName:"الظهر"
  },{
    key : "Asr",displayName:"العصر"
  },{
    key : "Maghrib",displayName:"المغرب"
  },{
    key : "Isha",displayName:"العشاء"
  }]
  const countDownTimer =()=>{
    const momentNow = moment();
    let prayerIndex = 2 ;
    if (
			momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
		) {
			prayerIndex = 1
		} else if (
			momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
		) {
      prayerIndex = 2
		} else if (
			momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
		) {
			prayerIndex = 3
		} else if (
			momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
		) {
			prayerIndex = 4
		} else {
			prayerIndex = 0
		}

    setNextPrayerIndex(prayerIndex)



    const nextPrayerObject = displayPrayes[prayerIndex];
		const nextPrayerTime = timings[nextPrayerObject.key];
		const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");
    console.log(nextPrayerTime);
    
		let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
console.log(remainingTime);

		if (remainingTime < 0) {
			const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
			const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
				moment("00:00:00", "hh:mm:ss")
			);

			const totalDiffernce = midnightDiff + fajrToMidnightDiff;
   
			remainingTime = totalDiffernce;
		}


		console.log(remainingTime);

		const durationRemainingTime = moment.duration(remainingTime);
    console.log(durationRemainingTime);
    
		setRemainingTime(
			`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
		);
		console.log(
			"duration issss ",
			durationRemainingTime.hours(),
			durationRemainingTime.minutes(),
			durationRemainingTime.seconds()
		);
  }
 const cityData =[{
    displayName : "مكة المكرمة",apiName:"Mecca" , countryIso :"SA"
  },
  {
    displayName : "المدينة المنورة",apiName:"Medina" , countryIso :"SA"
  },
  {
    displayName : "القدس",apiName:"Jerusalem " , countryIso :"PS"
  },
  {
    displayName : "القاهرة",apiName:"Cairo" , countryIso :"EG"
  },
  {
    displayName : "أسوان",apiName:"Aswan" , countryIso :"EG"
  }]
  useEffect(() => {
    axios
      .get(`https://api.aladhan.com/v1/timingsByCity?country=${selectedCity.countryIso}&city=${selectedCity.apiName}`)
      .then((res) => setTimings(res.data.data.timings))
      .catch((err) => console.log(err));
      
  }, [selectedCity]);
  useEffect(()=>{
    let interval = setInterval(() => {
      countDownTimer()
    }, 1000);
    const currentTime = moment();
      setTime(currentTime.format("MMM Do YYYY | h:mm" ))

      return ()=>{
        clearInterval(interval)
      }
  },[timings])

  const handleCityChange = (event) => {
    let city = cityData.find((c)=>{
      return c.apiName == event.target.value
    })
    setSelectedCity(city)
    console.log("selected :", city);
  };
  return (
    <>
      <Grid container>
        <Grid size={6}>
          <div>
            <h2> {time}</h2>
            <h5>{selectedCity.displayName} </h5>
          </div>
        </Grid>
        <Grid size={6}>
          <div>
            <h2 >متبقي حتي صلاه {displayPrayes[nextPrayerIndex].displayName}   </h2>
            <h5>{remainingTime} </h5>
          </div>
        </Grid>
      </Grid>
      <Divider style={{ backgroundColor: "white", opacity: 0.3 }} />

      {/* Prayers */}
      <Stack direction={"row"} justifyContent={"space-between"}>
        <PrayerCards name={"الفجر"} time={`${timings.Fajr}`} img={`${fjr}`} />
        <PrayerCards
          name={" الظهر"}
          time={`${timings.Dhuhr}`}
          img={`${duhr}`}
        />
        <PrayerCards name={" العصر"} time={`${timings.Asr}`} img={`${asr}`} />
        <PrayerCards
          name={"المغرب"}
          time={`${timings.Maghrib}`}
          img={`${magrip}`}
        />
        <PrayerCards name={"العشاء"} time={`${timings.Isha}`} img={`${isha}`} />
      </Stack>

      <Stack mt={3} direction={"row"} justifyContent={"center"}>
        <FormControl sx={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">
            <span style={{ color: "white" }}> المدينه </span>
          </InputLabel>
          <Select
            style={{ color: "white" }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
            onChange={handleCityChange}
          >
          {
            cityData.map((item)=>{
              return (
                <MenuItem value={item.apiName} key={item.displayName}>{item.displayName}</MenuItem>
              )
            })
          }
          </Select>
        </FormControl>
      </Stack>
    </>
  );
};

export default MainContent;
