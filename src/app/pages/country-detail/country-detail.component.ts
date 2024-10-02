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
  public countryName: string = '';
  public countryData: Olympic | undefined;
  public colorScheme: Color = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
    name: 'default',
    selectable: true,
    group: ScaleType.Ordinal
  };

  constructor(private route: ActivatedRoute, private router: Router, private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.countryName = params.get('name') || '';
      this.loadCountryData();
    });
  }

  loadCountryData(): void {
    this.olympicService.getOlympics().subscribe(data => {
      this.countryData = data.find((country: Olympic) => country.country === this.countryName);
    });
  }

  transformDataForLineChart(country: Olympic): any[] {
    return [{
      name: country.country,
      series: country.participations.map(participation => ({
        name: participation.year.toString(),
        value: participation.medalsCount
      }))
    }];
  }

  getParticipationCount(): number {
    return this.countryData ? this.countryData.participations.length : 0;
  }

  getTotalMedals(): number {
    return this.countryData ? this.countryData.participations.reduce((total, participation) => total + participation.medalsCount, 0) : 0;
  }

  getTotalAthletes(): number {
    return this.countryData ? this.countryData.participations.reduce((total, participation) => total + participation.athleteCount, 0) : 0;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}