import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as PIXI from 'pixi.js';
import { DisplacementFilter } from '@pixi/filter-displacement';
import { Assets } from 'pixi.js';

@Component({
  selector: 'app-ripple-image',
  templateUrl: './ripple-image.component.html',
  styleUrls: ['./ripple-image.component.scss']
})
export class RippleImageComponent implements AfterViewInit {
  @ViewChild('pixiContainer', { static: true }) pixiContainer!: ElementRef;

  private app!: PIXI.Application;
  private displacementSprite!: PIXI.Sprite;
  private displacementFilter!: DisplacementFilter;
  private imageSprite!: PIXI.Sprite;

  async ngAfterViewInit() {
    await this.initPixiApp();
  }

  async initPixiApp() {
    const container = this.pixiContainer.nativeElement;

    this.app = new PIXI.Application({
      width: container.clientWidth,
      height: container.clientHeight,
      backgroundAlpha: 0
    });

    container.appendChild(this.app.view);

    const imageURL = 'assets/imgs/pexels-pixabay-531602.jpg';
    const displacementMapURL = 'assets/displacement.png';

    const [imageTexture, displacementTexture] = await Promise.all([
      Assets.load(imageURL),
      Assets.load(displacementMapURL)
    ]);

    this.imageSprite = new PIXI.Sprite(imageTexture);
    this.imageSprite.width = container.clientWidth;
    this.imageSprite.height = container.clientHeight;
    this.app.stage.addChild(this.imageSprite);

    this.displacementSprite = new PIXI.Sprite(displacementTexture);
    this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    this.displacementSprite.scale.set(2);
    this.app.stage.addChild(this.displacementSprite);

    this.displacementFilter = new DisplacementFilter(this.displacementSprite);
    this.app.stage.filters = [this.displacementFilter as unknown as PIXI.Filter];

    // Animate displacement movement
    this.app.ticker.add(() => {
      this.displacementSprite.x += 1.5;
      this.displacementSprite.y += 1.2;
    });

    // Mouse ripple interaction
    container.addEventListener('mousemove', (e: MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      this.displacementFilter.scale.x = 40 * Math.sin(x * 0.05);
      this.displacementFilter.scale.y = 40 * Math.cos(y * 0.05);
    });

    container.addEventListener('mouseleave', () => {
      this.displacementFilter.scale.set(0);
    });
  }
}