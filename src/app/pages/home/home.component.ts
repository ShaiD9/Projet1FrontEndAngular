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
  public olympics$!: Observable<Olympic[]>;
  public pieChartData: any[] = [];
  public colorScheme: Color = {
    domain: ['#a95963','#adcded', '#a8385d', '#7aa3e5', '#a27ea8','#aae3f5'],
    name: 'default',
    selectable: true,
    group: ScaleType.Ordinal
  };
  public totalParticipations: number = 0;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics().pipe(
      map(data => {
        //console.log('Data from service:', data); //Verif données
        this.totalParticipations = this.calculateTotalParticipations(data);
        return this.transformDataForPieChart(data);
      })
    );
    this.olympics$.subscribe(data => {
      this.pieChartData = data;
      //console.log('Pie Chart Data:', this.pieChartData); //Verif données
    });
  }

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

  onSelect(event: any): void {
    this.router.navigate(['/country', event.name]);
  }
}