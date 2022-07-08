import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SidebarService } from '../sidebar/sidebar.service';
import * as fromStore from 'src/app/store';
import { AuthService } from 'src/app/services/auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  userDetails$ = this.appStore.select(fromStore.getUserDetails);

  constructor(
    public sidebarservice: SidebarService,
    private appStore: Store<fromStore.AppState>,
    private socialAuthService: SocialAuthService
  ) {}

  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  hideSidebar() {
    this.sidebarservice.setSidebarState(true);
  }

  ngOnInit() {
    /* Search Bar */
    $(document).ready(function () {
      $('.mobile-search-icon').on('click', function () {
        $('.search-bar').addClass('full-search-bar');
      }),
        $('.search-close').on('click', function () {
          $('.search-bar').removeClass('full-search-bar');
        });
    });
  }

  logout(): void {
    this.appStore.dispatch(new fromStore.Logout());
    location.href = '';
    // this.socialAuthService.signOut();
    // this.setConfigurationService
    //   .checkSetConfigurationPageForLeaving()
    //   .pipe(take(1))
    //   .subscribe(canLeave => {
    //     if (!canLeave) return;
    //     this.appStore.dispatch(new fromStore.Logout());
    //   });
  }
}
