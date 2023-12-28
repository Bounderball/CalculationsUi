import { Component, OnInit } from '@angular/core';
import { CalcAction } from './models/calc-action';
import { HttpClient } from '@angular/common/http';
import { MaxMinAvgResponse } from './models/max-min-avg-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CalculationsUi';
  result: CalcAction;
  calcActions: CalcAction[];
  stringA: string;
  stringB: string;
  actionType: string = "concatenate";

  constructor(private http: HttpClient) { }

  getAllActionsHistory(): void {
    this.http.get<CalcAction[]>("https://localhost:44311/api/CalcActions/get-all-actions-history").subscribe(
      (response) => {
        this.calcActions = response;
      }
    );
  }

  getMonthlyActionsAmountByType(): void {
    this.http.get<CalcAction[]>("https://localhost:44311/api/CalcActions/get-monthly-actions-amount-by-type/" + this.actionType).subscribe(
      (response) => {
        alert(response);
      }
    );
  }

  getMarginalActionResultsByType(): void {
    if (this.actionType == "concatenate" || this.actionType == "mix") {
      alert("Max, min and avg values are irrelevant for text-based calculations");
      return;
    }
    this.http.get<MaxMinAvgResponse>("https://localhost:44311/api/CalcActions/get-marginal-action-results-by-type/" + this.actionType).subscribe(
      (response) => {
        alert("Max: " + response.max + "\nMin: " + response.min + "\nAverage: " + response.avg);
      },
      (error) => {
        alert(error.error);
      }
    );
  }

  calculate(): void {
    let calcAction: CalcAction = new CalcAction();
    calcAction.actionType = this.actionType;
    calcAction.stringA = this.stringA;
    calcAction.stringB = this.stringB;

    this.http.post<CalcAction>("https://localhost:44311/api/CalcActions/post", calcAction).subscribe(
      (response) => {
        this.result = response;
      },
      (error) => {
        let errorMessage = error.error as string;
        if (errorMessage.startsWith("Input string")) {
          alert("Error. You may have tried to use a numeric operation on one or more non-numeric values. Try other operations like 'concatenate' or 'mix' for textual values.");
        }
        else {
          alert(error.error);
        }
      }
    );
  }

}
