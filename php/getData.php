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

//Getting Weather Info
$weatherData = file_get_contents("http://api.openweathermap.org/data/2.5/weather?q=$capital,$country&APPID=4264d96a45968735df7a8073aa680813");
$weatherData = json_decode($weatherData, true);
$average_temp = $weatherData['main']['temp'].' kelvin';
$temp_min = $weatherData['main']['temp_min'].' kelvin';
$temp_max = $weatherData['main']['temp_max'].' kelvin';
$pressure = $weatherData['main']['pressure'].' hPa';
$humidity = $weatherData['main']['humidity'].' %';
$cloud_percentage = $weatherData['clouds']['all'].' %';
$wind_speed = $weatherData['wind']['speed'].' meter/sec';
$wind_degree = $weatherData['wind']['deg'].' degrees';

//Setting Weather data and html for Weather Modal
$weatherHtml = "<table class='table table-borderless' style=font-size:2vh>";
$weatherHtml .= "<tr><th>Average Temperature</th><td>$average_temp</td></tr>";  
$weatherHtml .= "<tr><th>Max-Temperature</th><td>$temp_min</td></tr>";  
$weatherHtml .= "<tr><th>Min-Temperature</th><td>$temp_max</td></tr>";  
$weatherHtml .= "<tr><th>Pressure</th><td>$pressure</td></tr>";  
$weatherHtml .= "<tr><th>Humidity cases</th><td>$humidity</td></tr>";  
$weatherHtml .= "<tr><th>Cloud Percentage</th><td>$cloud_percentage</td></tr>";  
$weatherHtml .= "<tr><th>Wind Speed</th><td>$wind_speed</td></tr>";  
$weatherHtml .= "<tr><th>Wind Degrees</th><td>$wind_degree</td></tr>"; 
$weatherHtml .= "</table>";  

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