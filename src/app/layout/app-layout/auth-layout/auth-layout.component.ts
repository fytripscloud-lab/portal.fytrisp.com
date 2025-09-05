import { Direction, BidiModule } from '@angular/cdk/bidi';
import { Component, Inject, Renderer2 } from '@angular/core';
import { InConfiguration } from '@core';
import { ConfigService } from '@config';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: [],
  standalone: true,
  imports: [BidiModule, RouterOutlet],
})
export class AuthLayoutComponent extends UnsubscribeOnDestroyAdapter {
  direction!: Direction;
  public config!: InConfiguration;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private configService: ConfigService,
    private renderer: Renderer2
  ) {
    super();
    this.config = this.configService.configData;

    // set theme on startup
    if (localStorage.getItem('theme')) {
      this.renderer.removeClass(this.document.body, this.config.layout.variant);
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('theme') as string
      );
    } else {
      this.renderer.addClass(this.document.body, this.config.layout.variant);
    }
  }
}
