import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>; // Observable pour contenir la liste des données olympiques
  public pieChartData: any[] = []; // Tableau pour contenir les données du graphique circulaire
  public colorScheme: Color = { // Configuration des couleurs pour le graphique circulaire
    domain: ['#a95963','#adcded', '#a8385d', '#7aa3e5', '#a27ea8','#aae3f5'],
    name: 'default',
    selectable: true,
    group: ScaleType.Ordinal
  };
  public totalParticipations: number = 0; // Nombre total de participations à travers tous les pays

  // Injection des services OlympicService et Router dans le composant
  constructor(private olympicService: OlympicService, private router: Router) {}

  // Méthode qui se déclenche a l'initialisation du composant
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics().pipe(
      map(data => {
        //console.log('Data from service:', data); //Verif données
        this.totalParticipations = this.calculateTotalParticipations(data); //on appelle la méthode pour calculer le nombre total de participations
        return this.transformDataForPieChart(data); //on appelle la méthode pour transformer les données
      })
    );
    this.olympics$.subscribe(data => {
      this.pieChartData = data;
      //console.log('Pie Chart Data:', this.pieChartData); //Verif données
    });
  }

  // Méthode pour transformer les données olympiques en un format adapté pour le graphique circulaire
  transformDataForPieChart(data: Olympic[]): any[] {
    if (!data) {
      //console.error('No data available');
      return [];
    }
    return data.map(country => ({
      name: country.country,
      value: country.participations.reduce((acc: number, participation: Participation) => acc + participation.medalsCount, 0)
    }));
  }

  // Méthode pour calculer le nombre total de participations à travers tous les pays
  calculateTotalParticipations(data: Olympic[]): number {
    if (!data) {
      //console.error('No data available');
      return 0;
    }
    const uniqueParticipations = new Set<string>();
    data.forEach(country => {
      if (country.participations) {
        country.participations.forEach(participation => {
          uniqueParticipations.add(participation.year.toString());
        });
      }
    });
    return uniqueParticipations.size;
  }

  // Méthode pour gérer la sélection d'un pays depuis le graphique
  onSelect(event: any): void {
    this.router.navigate(['/country', event.name]);
  }
}