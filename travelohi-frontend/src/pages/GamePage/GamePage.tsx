import { useEffect, useRef, useState } from "react";
import { BackgroundSprite, Fighter } from "./models/classes";
import { rectangularCollision } from "./models/utils";
import Button from "../../components/Button/Button";
import styles from "./GamePage.module.scss";

const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spritesRef = useRef<{
    player: Fighter;
    enemy: Fighter;
    bg: BackgroundSprite;
  }>();

  const enemyBar = useRef<HTMLDivElement>(null);
  const playerBar = useRef<HTMLDivElement>(null);

  const bgmRef = useRef(new Audio("./audio/bgm.mp3"));
  const [gameStarted, setGameStarted] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  

  function animate(context: CanvasRenderingContext2D, lastTime: number) {
    const player = spritesRef.current?.player;
    const enemy = spritesRef.current?.enemy;
    const bg = spritesRef.current?.bg;

    const animationFrameId = window.requestAnimationFrame((timestamp) => {
      const deltaTime = timestamp - lastTime;

      if (deltaTime > 1000 / 240) {
        context.fillStyle = "black";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        bg?.draw(context, canvasRef.current!);

        if (!player || !enemy) return;

        player.isFlip = player.position.x > enemy.position.x;
        enemy.isFlip = enemy.position.x < player.position.x;

        player.attackBox.position.x =
          player.position.x +
          (player.isFlip
            ? -player.attackBox.offset.x
            : player.attackBox.offset.x);
        player.attackBox.position.y = player.position.y;

        enemy.attackBox.position.x =
          enemy.position.x +
          (enemy.isFlip ? -enemy.attackBox.offset.x : enemy.attackBox.offset.x);
        enemy.attackBox.position.y = enemy.position.y;

        spritesRef.current?.player.update(context);
        spritesRef.current?.enemy.update(context);

        // Ngecek collision
        if (player && enemy) {
          if (
            player.isAttacking &&
            rectangularCollision(player.attackBox, enemy)
          ) {
            player.isAttacking = false;
            console.log("Player hit the enemy!");

            enemy.health -= 20;
            enemyBar.current!.style.width = enemy.health + "%";
          }

          if (
            enemy.isAttacking &&
            rectangularCollision(enemy.attackBox, player)
          ) {
            enemy.isAttacking = false;
            console.log("Enemy hit the player!");

            player.health -= 20;
            playerBar.current!.style.width = player.health + "%";
          }
        }
        lastTime = timestamp;
      }

      animate(context, lastTime);
    });

    return () => window.cancelAnimationFrame(animationFrameId);
  }

  const pressedKeysRef = useRef(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      const player = new Fighter({
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        color: "red",
        offset: {
          x: 0,
          y: 0,
        },
        scale: 2.5,
        sprites: {
          idle: {
            imageSrc: "./GunPlayer/idle-gun.png",
            frameMax: 6,
          },
          run: {
            imageSrc: "./GunPlayer/gun-walk.png",
            frameMax: 3,
          },
          jump: {
            imageSrc: "./GunPlayer/gun-jump.png",
            frameMax: 1,
          },
          lowKick: {
            imageSrc: "./GunPlayer/gun-low-kick.png",
            frameMax: 4,
          },
          frontKick: {
            imageSrc: "./GunPlayer/gun-front-kick.png",
            frameMax: 3,
          },
        },
        reversedSprites: {
          idle: {
            imageSrc: "./GunPlayerReversed/idle-gun.png",
            frameMax: 6,
          },
          run: {
            imageSrc: "./GunPlayerReversed/gun-walk.png",
            frameMax: 3,
          },
          jump: {
            imageSrc: "./GunPlayerReversed/gun-jump.png",
            frameMax: 1,
          },
          lowKick: {
            imageSrc: "./GunPlayerReversed/gun-low-kick.png",
            frameMax: 4,
          },
          frontKick: {
            imageSrc: "./GunPlayerReversed/gun-front-kick.png",
            frameMax: 3,
          },
        },
        imageSrc: "./GunPlayer/idle-gun.png",
        isFlip: false,
      });

      const enemy = new Fighter({
        position: { x: 400, y: 100 },
        velocity: { x: 0, y: 0 },
        color: "blue",
        offset: {
          x: -50,
          y: 0,
        },
        imageSrc: "./SwordPlayer/sword-idle.png",
        scale: 2.5,
        reversedSprites: {
          idle: {
            imageSrc: "./SwordPlayer/sword-idle.png",
            frameMax: 6,
          },
          run: {
            imageSrc: "./SwordPlayer/sword-walk.png",
            frameMax: 10,
          },
          jump: {
            imageSrc: "./SwordPlayer/sword-jump.png",
            frameMax: 6,
          },
          lowKick: {
            imageSrc: "./SwordPlayer/sword-low-kick.png",
            frameMax: 3,
          },
          frontKick: {
            imageSrc: "./SwordPlayer/sword-front-kick.png",
            frameMax: 4,
          },
        },
        sprites: {
          idle: {
            imageSrc: "./SwordPlayerReversed/idle-sword.png",
            frameMax: 6,
          },
          run: {
            imageSrc: "./SwordPlayer/sword-walk.png",
            frameMax: 10,
          },
          jump: {
            imageSrc: "./SwordPlayer/sword-jump.png",
            frameMax: 6,
          },
          lowKick: {
            imageSrc: "./SwordPlayerReversed/sword-low-kick.png",
            frameMax: 3,
          },
          frontKick: {
            imageSrc: "./SwordPlayerReversed/sword-front-kick.png",
            frameMax: 4,
          },
        },
        isFlip: false,
      });

      const bg = new BackgroundSprite("./background.png");

      spritesRef.current = { player, enemy, bg };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (gameOver) return;

        if (!spritesRef.current) return;

        // Add reference to the pressed key
        pressedKeysRef.current.add(event.key);

        const { player, enemy } = spritesRef.current;

        if (
          pressedKeysRef.current.has("s") &&
          pressedKeysRef.current.has(" ")
        ) {
          player.lowKick();
          return;
        }

        if (
          pressedKeysRef.current.has("d") &&
          pressedKeysRef.current.has(" ")
        ) {
          player.frontKick();
          return;
        }

        switch (event.key) {
          case "d":
            player.moveRight();
            break;
          case "a":
            spritesRef.current?.player.moveLeft();

            break;
          case "w":
            spritesRef.current?.player.jump();
            break;

          case "ArrowRight":
            spritesRef.current?.enemy.moveRight();
            break;
          case "ArrowLeft":
            spritesRef.current?.enemy.moveLeft();
            break;
          case "ArrowUp":
            spritesRef.current?.enemy.jump();
            break;
        }
      };

      const handleKeyUp = (event: KeyboardEvent) => {

        if (event.key === "s" || event.key === " ") {
          spritesRef.current?.player.finishAttack();
        }

        pressedKeysRef.current.delete(event.key);
        console.log(event.key);

        switch (event.key) {
          case "d":
          case "a":
            spritesRef.current?.player.stop();
            break;

          case "ArrowRight":
          case "ArrowLeft":
            spritesRef.current?.enemy.stop();
            break;
        }
      };

      window.addEventListener("keyup", handleKeyUp);
      window.addEventListener("keydown", handleKeyDown);

      const stopAnimation = animate(context, 0);


      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        stopAnimation();
      };
    }
  }, []);

  

  useEffect(() => {
    const bgm = bgmRef.current;
    bgm.loop = true;
    bgm.volume = 1;

    bgm.play().catch((error) => console.error("Error playing music:", error));

    return () => {
      bgm.pause();
    };
  }, [gameStarted]);

  const [timer, setTimer] = useState<number>(100);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameStarted) {
      if (timer > 0) {
        interval = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);

        const playerHealth = spritesRef.current?.player.health || 0;
        const enemyHealth = spritesRef.current?.enemy.health || 0;

        if (playerHealth === 0 || enemyHealth === 0) {
          setTimer(0)
        }
      } else if (timer === 0) {
        const playerHealth = spritesRef.current?.player.health || 0;
        const enemyHealth = spritesRef.current?.enemy.health || 0;

        console.log("Game over status is " + gameOver);

        if (playerHealth > enemyHealth) {
          alert("Win!");
        } else if (playerHealth === enemyHealth) {
          alert("It's a draw!");
        } else {
          alert("Lose!");
        }

        setGameOver(true);
        if (interval) clearInterval(interval);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className={styles.container}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{
            position: "absolute",
            display: "flex",
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* Player Health Bar */}
          <div
            style={{
              position: "relative",
              height: "30%",
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                backgroundColor: "yellow",
                height: "30px",
                width: "100%",
              }}
            ></div>
            <div
              ref={playerBar}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                width: "100%",
                backgroundColor: "blue",
              }}
            ></div>
          </div>
          {/* Timer */}
          <div
            style={{
              backgroundColor: "red",
              height: "100px",
              width: "100px",
              flexShrink: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {timer}
          </div>
          {/*  Enemy Health Bar */}
          <div style={{ position: "relative", height: "30px", width: "100%" }}>
            <div
              style={{
                backgroundColor: "yellow",
                height: "30px",
                width: "100%",
              }}
            >
              {" "}
            </div>
            <div
              ref={enemyBar}
              style={{
                width: "100%",
                backgroundColor: "blue",
                position: "absolute",
                top: "0",
                bottom: "0",
                right: "0",
                left: "0",
              }}
            ></div>
          </div>
        </div>
        <canvas ref={canvasRef} width={1024} height={576} />
      </div>
      <Button onClick={startGame} outlined>
        Start The Game!
      </Button>
    </div>
  );
};

export default GamePage;
