const gravity = 0.2;
const moveSpeed = 1;

interface SpriteConfig {
  imageSrc: string;
  image?: HTMLImageElement;
  frameMax: number;
}

interface SpriteImg {
  idle: SpriteConfig;
  run: SpriteConfig;
  jump: SpriteConfig;
  lowKick: SpriteConfig;
  frontKick: SpriteConfig;
}

export class Sprite {
  position: { x: number; y: number };
  height: number;
  width: number;
  image?: HTMLImageElement;
  imageLoaded: boolean;
  scale: number;
  framesMax: number;
  currentFrame: number;
  frameElapsed: number;
  frameHold: number;

  constructor(spriteProps: {
    position: { x: number; y: number };
    imageSrc: string;
    scale?: number;
    framesMax: number;
  }) {
    this.position = spriteProps.position;
    this.height = 150;
    this.width = 50;
    this.imageLoaded = false;
    this.scale = spriteProps.scale ?? 1;

    this.framesMax = spriteProps.framesMax ?? 1;

    this.image = new Image();
    this.image.src = spriteProps.imageSrc;
    this.image.onload = () => {
      this.imageLoaded = true;
    };

    this.currentFrame = 0;
    this.frameElapsed = 0;
    this.frameHold = 10;
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.imageLoaded) {
      const frameWidth = this.image!.width / this.framesMax;

      context.drawImage(
        this.image!,
        frameWidth * this.currentFrame,
        0,
        frameWidth,
        this.image!.height,
        this.position.x,
        this.position.y,
        frameWidth * this.scale,
        this.image!.height * this.scale
      );
    }
  }

  animateFrame() {
    this.frameElapsed++;

    if (this.frameElapsed % this.frameHold === 0) {
      if (this.currentFrame < this.framesMax - 1) this.currentFrame++;
      else this.currentFrame = 0;
    }
  }
  update(context: CanvasRenderingContext2D) {
    this.draw(context);

    this.frameElapsed++;

    this.animateFrame();
  }
}

export class BackgroundSprite {
  image: HTMLImageElement;
  imageLoaded: boolean;

  constructor(imageSrc: string) {
    this.image = new Image();
    this.imageLoaded = false;

    this.image.src = imageSrc;
    this.image.onload = () => {
      this.imageLoaded = true;
    };
  }

  draw(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    if (this.imageLoaded && this.image && canvas) {
      const canvasAspectRatio = canvas.width / canvas.height;
      const imageAspectRatio = this.image.width / this.image.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasAspectRatio > imageAspectRatio) {
        // Canvas is wider than the image's aspect ratio
        drawWidth = canvas.width;
        drawHeight = drawWidth / imageAspectRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        // Canvas is taller than the image's aspect ratio
        drawHeight = canvas.height;
        drawWidth = drawHeight * imageAspectRatio;
        offsetY = 0;
        offsetX = (canvas.width - drawWidth) / 2;
      }

      context.drawImage(this.image, offsetX, offsetY, drawWidth, drawHeight);
    }
  }
}

export class Fighter extends Sprite {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  height: number;
  width: number;
  attackBox: {
    position: { x: number; y: number };
    width: number;
    height: number;
    offset: { x: number; y: number };
  };
  color: string;
  health: number;
  sprites: SpriteImg;
  reversedSprites: SpriteImg;
  state: "idle" | "running" | "jumping" | "attacking";

  isGround: boolean;
  isAttacking: boolean;
  isFlip: boolean;

  constructor(spriteProps: {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    color: string;
    offset: { x: number; y: number };
    imageSrc: string;
    scale?: number;
    sprites: SpriteImg;
    reversedSprites: SpriteImg;
    isFlip: boolean;
  }) {
    super({
      position: spriteProps.position,
      imageSrc: spriteProps.imageSrc,
      scale: spriteProps.scale,
      framesMax: spriteProps.sprites.idle.frameMax,
    });

    this.position = spriteProps.position;
    this.velocity = spriteProps.velocity;
    this.height = 150;
    this.width = 50;
    this.isGround = false;
    this.isAttacking = false;

    this.health = 100;

    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      offset: spriteProps.offset,
    };

    this.color = spriteProps.color;

    this.sprites = spriteProps.sprites;
    this.reversedSprites = spriteProps.reversedSprites;
    this.isFlip = spriteProps.isFlip;

    Object.keys(this.sprites).forEach((key) => {
      const sprite = this.sprites[key as keyof SpriteImg];
      sprite.image = new Image();
      sprite.image.src = sprite.imageSrc;
    });

    Object.keys(this.reversedSprites).forEach((key) => {
      const sprite = this.reversedSprites[key as keyof SpriteImg];
      sprite.image = new Image();
      sprite.image.src = sprite.imageSrc;
    });

    //  Set up animations
    this.currentFrame = 0;
    this.frameElapsed = 0;
    this.frameHold = 30;

    this.state = "idle";
  }

  update(context: CanvasRenderingContext2D) {
    this.draw(context);
    this.animateFrame();



    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (
      this.state === "attacking" &&
      this.currentFrame === this.sprites.lowKick.frameMax - 1
    ) {
      this.finishAttack();
    }

    if (
      this.position.y + this.height + this.velocity.y >=
      context.canvas.height - 60
    ) {
      this.velocity.y = 0;
      this.isGround = true;
    } else {
      this.velocity.y += gravity;
      this.isGround = false;
    }

    // Biar ga keluar canvas
    this.position.x = Math.max(
      0,
      Math.min(this.position.x, context.canvas.width - 50)
    );

    if (this.isGround && this.state === "jumping") {
      // Character has landed, revert to idle state
      this.switchSprite("idle");
      this.state = "idle";
    }
  }

  moveLeft() {
    this.velocity.x = -moveSpeed;

    this.switchSprite("running");
  }

  moveRight() {
    this.velocity.x = moveSpeed;
    this.switchSprite("running");
  }

  jump() {
    if (this.isGround) {
      this.velocity.y -= 10;
      this.isGround = false;

      this.switchSprite("jumping");
      this.state = "jumping";
    }
  }

  finishAttack() {
    this.isAttacking = false;
    this.switchSprite("idle");
  }

  lowKick() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.switchSprite("lowKick");
      this.state = "attacking";
    }
  }

  frontKick() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.switchSprite("frontKick");
      this.state = "attacking";
    }
  }

  stop() {
    this.velocity.x = 0;
    this.switchSprite("idle");
  }

  switchSprite(sprite: string) {
    const activeSprite = this.isFlip ? this.reversedSprites : this.sprites;

    if (
      this.image === activeSprite.lowKick.image &&
      this.currentFrame < activeSprite.lowKick.frameMax - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image !== activeSprite.idle.image) {
          this.image = activeSprite.idle.image;
          this.framesMax = activeSprite.idle.frameMax;
          this.frameElapsed = 0;
        }
        break;
      case "running":
        if (this.image !== activeSprite.run.image) {
          this.image = activeSprite.run.image;
          this.framesMax = activeSprite.run.frameMax;
          this.frameElapsed = 0;
        }
        break;
      case "jumping":
        if (this.image !== activeSprite.jump.image) {
          this.image = activeSprite.jump.image;
          this.framesMax = activeSprite.jump.frameMax;
          this.frameElapsed = 0;
        }
        break;
      case "lowKick":
        if (this.image !== activeSprite.lowKick.image) {
          this.image = activeSprite.lowKick.image;
          this.framesMax = activeSprite.lowKick.frameMax;
          this.frameElapsed = 0;
        }
        break;
      case "frontKick":
        if (this.image !== activeSprite.frontKick.image) {
          this.image = activeSprite.frontKick.image;
          this.framesMax = activeSprite.frontKick.frameMax;
          this.frameElapsed = 0;
        }
    }
  }
}
