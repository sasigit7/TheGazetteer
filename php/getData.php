<?php

$country = $_POST['country'];

//Getting info from restcountries api
$data = file_get_contents("https://restcountries.eu/rest/v2/alpha/$country");
//Attaching data to PHP variables
$data = json_decode($data, true);
$country_name = $data['name'];
$capital = $data['capital'];
$population = $data['population'];
$flag = $data['flag'];
$currency = $data['currencies'][0]['name'];
$lat = $data['latlng'][0];
$lng = $data['latlng'][1];

//Setting Country data/html for Modal info	
$countryHtml = "<div class='card text-white bg-info m-10' style='max-width: 100vw;'><div class='card-header'><i class='fas fa-arrow-left' style='margin-right: 16px;' onclick='hide_popup()'></i><h2 style='display: inline;'>$country_name</h2></div><div class='card-body pb-10' style='overflow-y: auto;'><p class='card-text'>";
$countryHtml .= "<table class='table table-borderless text-white'>";  
$countryHtml .= "<tr><th>Capital</th><td>$capital</td></tr>";  
$countryHtml .= "<tr><th>Population</th><td>$population</td></tr>";  
$countryHtml .= "<tr><th>Flag</th><td><img src='$flag' style='height:50px'></td></tr>";
$countryHtml .= "<tr><th>Currency</th><td>$currency</td></tr>";  
$countryHtml .= "<tr><th>Wikipedia</th><td><a href='https://en.wikipedia.org/wiki/$country' target='#' class='text-dark'>$country</a></td></tr>";  
$countryHtml .= "</table>";
$countryHtml .= "<div class='btn-group btn-group-sm' role='group' aria-label='Basic example'>
<button type='button' class='btn btn-danger m-1' data-toggle='modal' data-target='#coronoModal'><i class='fal fa-shield-virus'></i> Covid</button>
<button type='button' class='btn btn-success m-1' data-toggle='modal' data-target='#weatherModal'><i class='fas fa-cloud-sun'></i> Weather</button>
<button type='button' class='btn btn-warning m-1' data-toggle='modal' data-target='#newsModal'> <i class='far fa-newspaper'></i> News</button></div>
</div></div>";  

//Getting Covid Info
$coronoData = file_get_contents("https://corona.lmao.ninja/v2/countries/$country?yesterday&strict&query");
$coronoData = json_decode($coronoData, true);
$total_cases =  $coronoData['cases'];
$active =  $coronoData['active'];
$recovered =  $coronoData['recovered'];
$deaths =  $coronoData['deaths'];
$todayCases =  $coronoData['todayCases'];
$todayRecovered =  $coronoData['todayRecovered'];
$todayDeaths =  $coronoData['todayDeaths'];
$activePerOneMillion =  $coronoData['activePerOneMillion'];
$recoveredPerOneMillion =  $coronoData['recoveredPerOneMillion'];

//Setting Covid data and html for Covid Modal
$coronaHtml = "<table class='table table-borderless' style=font-size:2vh>";
$coronaHtml .= "<tr><th>Total cases</th><td>$total_cases</td></tr>";  
$coronaHtml .= "<tr><th>Active</th><td>$active</td></tr>";  
$coronaHtml .= "<tr><th>Recovered</th><td>$recovered</td></tr>";  
$coronaHtml .= "<tr><th>Deaths</th><td>$deaths</td></tr>";  
$coronaHtml .= "<tr><th>Today cases</th><td>$todayCases</td></tr>";  
$coronaHtml .= "<tr><th>Today Recovered</th><td>$todayRecovered</td></tr>";  
$coronaHtml .= "<tr><th>Today Deaths</th><td>$todayDeaths</td></tr>";  
$coronaHtml .= "<tr><th>Active per Million</th><td>$activePerOneMillion</td></tr>";  
$coronaHtml .= "<tr><th>Recovered per Million</th><td>$recoveredPerOneMillion</td></tr>";  
$coronaHtml .= "</table>";  

// Getting Weather Info
$weatherData = file_get_contents("https://api.openweathermap.org/data/2.5/onecall?lat=$lat&lon=$lng&exclude=current,minutely,hourly,alerts&APPID=4264d96a45968735df7a8073aa680813");
$weatherData = json_decode($weatherData, true);

//Setting Weather data and html for Weather Modal
$weatherHtml = "<table class='table table-borderless' style=font-size:2vh><thead>";
$weatherHtml .= "<tr><th>Date</th><th>Day</th><th>Min</th><th>Max</th><th>Night</th><th>Evening</th>";
$weatherHtml .= "<!--<th>Morning</th><th>Pressure</th><th>Humidity cases</th><th>Cloud Percentage</th><th>Wind Speed</th><th>Wind Degrees</th>--></tr></thead><tbody>";

// The sizeof() function returns the number of elements in an array.
for($i=0;$i<sizeof($weatherData['daily']);$i++){
    $d = $weatherData['daily'][$i];
    $date = date('Y-m-d',$d['dt']);
    $temp_day = $d['temp']['day'];//.' kelvin';
    $temp_min = $d['temp']['min'];//.' kelvin';
    $temp_max = $d['temp']['max'];//.' kelvin';
    $temp_night = $d['temp']['night'];//.' kelvin';
    $temp_eve = $d['temp']['eve'];//.' kelvin';
    $temp_morn = $d['temp']['morn'];//.' kelvin';
    $pressure = $d['pressure'].' hPa';
    $humidity = $d['humidity'].'%';
    $cloud_percentage = $d['clouds'].'%';
    $wind_speed = $d['wind_speed'].'meter/sec';
    $wind_degree = $d['wind_deg'].'degrees';

    $weatherHtml .= "<tr><td>$date</td><td>$temp_day</td><td>$temp_min</td><td>$temp_max</td><td>$temp_night</td><td>$temp_eve</td>";
    $weatherHtml .= "</tr>";
}
$weatherHtml .= "</tbody></table>";

// Getting News Info 
$newsData = file_get_contents("http://api.mediastack.com/v1/news?country=$country&access_key=529740f259ac5f9a3db2e50100c43d28");
$newsData = json_decode($newsData, true);
$newsHtml = "<table class='table table-borderless' style=font-size:2vh>";
$newsData = $newsData['data'];
for ($row = 0; $row < 5; $row++) {
		$data = $newsData[$row]['title'];
		$url = $newsData[$row]['url'];
		$newsHtml .= "<tr><td><i class='far fa-newspaper'></i> <a href='$url' target='#' class='text-primary'>$data</a></td></tr>";
	}
 $newsHtml .= "</table>";  
//Sending data to Javascript 
echo json_encode(array("countryHtml" => $countryHtml, "covid_data" => $coronaHtml,  "weather_data" => $weatherHtml, "news_data" => $newsHtml));
?>