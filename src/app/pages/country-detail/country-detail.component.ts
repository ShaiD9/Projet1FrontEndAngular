import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit {
  public countryName: string = ''; // Nom du pays sélectionné
  public countryData: Olympic | undefined; // Données olympiques pour le pays sélectionné
  public colorScheme: Color = { // Configuration des couleurs pour le graphique en lignes
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
    name: 'default',
    selectable: true,
    group: ScaleType.Ordinal
  };

  //injection des services OlympicService et Router dans le composant
  constructor(private route: ActivatedRoute, private router: Router, private olympicService: OlympicService) {}

  // Méthode qui se déclenche a l'initialisation du composant
  ngOnInit(): void {
    // Récupération du nom du pays depuis les paramètres de la route
    this.route.paramMap.subscribe(params => {
      this.countryName = params.get('name') || '';
      this.loadCountryData();
    });
  }

  // Méthode pour charger les données olympiques pour le pays sélectionné
  loadCountryData(): void {
    this.olympicService.getOlympics().subscribe(data => {
      // Recherche des données du pays correspondant au nom sélectionné
      this.countryData = data.find((country: Olympic) => country.country === this.countryName);
    });
  }

  // Méthode pour transformer les données du pays en un format adapté pour le graphique en lignes
  transformDataForLineChart(country: Olympic): any[] {
    return [{
      name: country.country,
      series: country.participations.map(participation => ({
        name: participation.year.toString(),
        value: participation.medalsCount
      }))
    }];
  }

  // Méthode pour obtenir le nombre de participations du pays sélectionné
  getParticipationCount(): number {
    return this.countryData ? this.countryData.participations.length : 0;
  }

  // Méthode pour obtenir le nombre total de médailles du pays sélectionné
  getTotalMedals(): number {
    return this.countryData ? this.countryData.participations.reduce((total, participation) => total + participation.medalsCount, 0) : 0;
  }

  // Méthode pour obtenir le nombre total d'athlètes du pays sélectionné
  getTotalAthletes(): number {
    return this.countryData ? this.countryData.participations.reduce((total, participation) => total + participation.athleteCount, 0) : 0;
  }

  // Méthode pour naviguer à la page d'accueil
  goBack(): void {
    this.router.navigate(['/']);
  }
}