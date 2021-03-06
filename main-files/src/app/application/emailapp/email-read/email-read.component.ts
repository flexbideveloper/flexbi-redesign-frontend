import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-read',
  templateUrl: './email-read.component.html',
  styleUrls: ['./email-read.component.scss']
})
export class EmailReadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
     // email toggle
     $(".email-toggle-btn").on("click", function () {
      $(".email-wrapper").toggleClass("email-toggled");
    });
    $(".email-toggle-btn-mobile").on("click", function () {
      $(".email-wrapper").removeClass("email-toggled");
    });
    // compose mail
    $(".compose-mail-btn").on("click", function () {
      $(".compose-mail-popup").show();
    });
    $(".compose-mail-close").on("click", function () {
      $(".compose-mail-popup").hide();
    });
  }

}
