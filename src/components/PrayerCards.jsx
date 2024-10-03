import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea'; 
// eslint-disable-next-line react/prop-types
const PrayerCards = ({name , time,img}) => {

    
    return (
        <Card sx={{ width:"14%" , mt:3}}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={img}
            alt="green iguana"
          />
          <CardContent>
            <h2 >
              {name}
            </h2>
            <h1 style={{ color: 'text.secondary' }}>
              {time}
            </h1>
          </CardContent>
        </CardActionArea>
      </Card>
    );
}

export default PrayerCards;
