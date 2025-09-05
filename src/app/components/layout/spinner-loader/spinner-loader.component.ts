import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoadingService } from './LoadingService';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-spinner-loader',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule
    ],
    template: `
    <div class="container-flex">
        <div class="image-container">
      <img class="fill-image" src="4fill.png">
    </div>
    <div class="cup">
        <span class="steam"></span>
        <span class="steam"></span>
        <span class="steam"></span>
        <div class="cup-handle"></div>
    </div>
    </div>
    
  `,
    styles: `

    .container-flex {
    display: flex;
    align-items: center;
    }
  

  .fill-image{
    width: 200px;
    height: 200px;
    object-fit: contain ;
  }

  .image-container {
   width: 102px;
   overflow: hidden;
   margin-bottom: 10px;
  }


  .cup {
    position: relative;
    width: 100px;
    height: 100px;
    border: 8px solid #ffefdb;
    box-shadow: 0 0 0 12px #352a22;
    border-radius: 10px 10px 60px 75px;
    background: url('/img/coffee.png');
    background-repeat: repeat-x;
    background-position: 0 130px;
    animation: filling 2s infinite;
}

@keyframes filling {
    0%, 100% {
        background-position: 0 130px;
    }

    50% {
        background-position: 600px -70px;
    }
}

.cup .cup-handle {
    position: absolute;
    top: 10px;
    right: -74px;
    width: 65px;
    height: 50px;
    border: 12px solid #352a22;
    border-radius: 20px 10px 50px 20px;
}

.cup .steam {
    position: absolute;
    border-radius: 10px 2px;
    width: 8px;
    animation: steaming 1s infinite;
}

@keyframes steaming {
    0%, 100% {
        opacity: 0;
    }

    50% {
        opacity: 1;
        filter: blur(.8px);
        transform: translateY(-10px);
    }
}

.cup .steam:nth-child(1) {
    top: -70px;
    left: 10px;
    height: 30px;
    background: #8e5a3423;
    animation-delay: .2s;
}

.cup .steam:nth-child(2) {
    top: -120px;
    left: 35px;
    height: 50px;
    background: #8e5a3454;
    animation-delay: .6s;
}

.cup .steam:nth-child(3) {
    top: -90px;
    left: 65px;
    height: 40px;
    background: #8e5a3433;
    animation-delay: 1s;
}
  `
})
export class SpinnerLoaderComponent {


}
