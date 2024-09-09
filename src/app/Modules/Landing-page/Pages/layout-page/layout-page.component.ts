import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css'],
})
export class LayoutPageComponent implements OnInit {
  ngOnInit(): void {
    localStorage.removeItem('Authorization');
    this.getCountry();
  }

  getCountry() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Utilizar una API de geolocalización para obtener el país basado en las coordenadas
          this.getCountryFromCoordinates(latitude, longitude)
            .then((country) => {
              localStorage.setItem('country', country);
            })
            .catch((error) => {
              localStorage.removeItem('country');
              // console.error('Error getting country from coordinates:', error);
            });
        },
        (error) => {
          localStorage.removeItem('country');

          // console.error('Geolocation error:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      localStorage.removeItem('country');
    }
  }

  getCountryFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string> {
    // Aquí deberías llamar a una API que convierta las coordenadas en información sobre el país
    // Por simplicidad, este ejemplo utiliza una API de terceros gratuita, que puede tener limitaciones de uso
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch country from coordinates');
        }
        return response.json();
      })
      .then((data) => {
        return data.countryCode;
      });
  }
}
