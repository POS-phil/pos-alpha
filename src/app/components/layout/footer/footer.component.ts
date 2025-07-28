import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer class="dash-footer">
      <div class="dash-footer-container">
        <div class="dash-footer-container-version">
          <span>Development Build : Alpha Version {{year}}.</span>
          <span> Build no. 090425. </span>
        </div>
      </div>
    </footer>
  `,
  styles: `

  footer {
    border-top: solid 1px var(--mat-sys-outline-variant);
  }

  :host {
    display: block;
    margin-top: 100px;
  }
  
  .dash-footer {
    padding: 12px;
    font-size: 12px;
  }

  .dash-footer-container {
    align-items: center;
    display: flex;
    flex-flow: row wrap;
    padding: 8px;
  }

  .dash-footer-container-version {

    display: flex;
    flex: 1;
    justify-content: flex-end;
    flex-direction: column;
    min-width: 225px;
    margin-top: 16px;

      div {
        display: flex;
        flex-direction: column;
        align-self: flex-end;
        text-align: center;
      }

      @media (min-width: 885px) {
        margin-top: 0;
      }

  }

  a {
    color: var(--mat-sys-on-surface-variant);
    text-decoration: none;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }

  @media screen and (max-width: 884px){
    .dash-footer-container {
      flex-direction: column;
    }
  }
  
  `
})
export class FooterComponent {

  year = new Date().getFullYear();

}
