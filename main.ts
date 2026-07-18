namespace SpriteKind {
    export const Effect = SpriteKind.create()
    export const Explosion = SpriteKind.create()
    export const Background = SpriteKind.create()
    export const Foreground = SpriteKind.create()
    export const InventorySlot = SpriteKind.create()
    export const Icon = SpriteKind.create()
    export const SplashScreen = SpriteKind.create()
}
namespace StatusBarKind {
    export const XP = StatusBarKind.create()
    export const player = StatusBarKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (HasState(STATE_ATTACK)) {
        while (HasState(STATE_ATTACK)) {
            DoDamage(otherSprite, sprite)
            pause(IFrameDuration)
        }
    } else {
        DoDamage(sprite, otherSprite)
        pause(IFrameDuration * 2)
    }
})
function AddEffect (Duration: number, x: number, y: number) {
    EffectSystem = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Effect)
}
function AddExplosion (ExplosionType: string, Size: number, Damage: number, x: number, y: number, Instigator: Sprite) {
    ExplosionEffect = sprites.createProjectileFromSide(assets.image`ExplosionSprite`, 0, 0)
    ExplosionEffect.setKind(SpriteKind.Explosion)
    sprites.setDataSprite(ExplosionEffect, "Instigator", Instigator)
    sprites.setDataNumber(ExplosionEffect, "BlastDamage", Damage)
    ExplosionEffect.setPosition(x, y)
    ExplosionEffect.scale = Size
    if (ExplosionType == EXPLOSION_MAGIC) {
        scene.cameraShake(9, 400)
        animation.runImageAnimation(
        ExplosionEffect,
        assets.animation`effect_nuclear_blast`,
        50,
        false
        )
        ExplosionEffect.x += -50
        ExplosionEffect.y += -50
        timer.after(200, function () {
            ExplosionEffect.scale = 1.25 * Size
            timer.after(50, function () {
                ExplosionEffect.scale = 1.35 * Size
                timer.after(50, function () {
                    ExplosionEffect.scale = 1.5 * Size
                    timer.after(50, function () {
                        ExplosionEffect.scale = 1.65 * Size
                    })
                })
            })
        })
    } else if (ExplosionType == EXPLOSION_FIREBALL) {
        scene.cameraShake(2, 100)
        animation.runImageAnimation(
        ExplosionEffect,
        assets.animation`ExplosionSpriteAnim3`,
        50,
        false
        )
    } else if (ExplosionType == EXPLOSION_TNT) {
        animation.runImageAnimation(
        ExplosionEffect,
        assets.animation`ExplosionSpriteAnim3`,
        50,
        false
        )
    }
}
function ScrollingBackground (Dimension: number, Scrolling: boolean) {
    Backdrops = []
    if (Dimension == 0) {
        Backdrops = [[[
        assets.image`cave_ceiling_foreground_1`,
        assets.image`cave_ceiling_foreground_2`,
        assets.image`cave_ceiling_foreground_3`,
        assets.image`cave_ceiling_foreground_4`,
        assets.image`cave_ceiling_foreground_5`
        ], [
        assets.image`cave_floor_foreground_1`,
        assets.image`cave_floor_foreground_2`,
        assets.image`cave_floor_foreground_3`,
        assets.image`cave_floor_foreground_4`,
        assets.image`cave_floor_foreground_5`,
        assets.image`cave_floor_foreground_6`,
        assets.image`cave_floor_foreground_7`
        ]], [[
        assets.image`cave_ceiling_background_1`,
        assets.image`cave_ceiling_background_2`,
        assets.image`cave_ceiling_background_3`,
        assets.image`cave_ceiling_background_4`
        ], [
        assets.image`cave_floor_background_1`,
        assets.image`cave_floor_background_2`,
        assets.image`cave_floor_background_3`,
        assets.image`cave_floor_background_4`,
        assets.image`cave_floor_background_5`,
        assets.image`cave_floor_background_6`,
        assets.image`cave_floor_background_7`
        ]]]
        tiles.setCurrentTilemap(tilemap`overworld_tilemap`)
        CreateForeground(0)
        CreateBackground(0)
        for (let index = 0; index < 2; index++) {
            CreateForeground(LastFloorForeground.right)
            CreateBackground(LastFloorBackground.right)
        }
    }
    if (Dimension == 1) {
    	
    }
    if (Dimension == 2) {
    	
    }
    timer.background(function () {
        while (Scrolling) {
            for (let value of sprites.allOfKind(SpriteKind.Foreground)) {
                value.x += -2
            }
            pause(350)
        }
    })
    timer.background(function () {
        while (Scrolling) {
            for (let value2 of sprites.allOfKind(SpriteKind.Background)) {
                value2.x += -2
            }
            pause(700)
        }
    })
    timer.background(function () {
        while (Scrolling) {
            for (let value3 of sprites.allOfKind(SpriteKind.Background)) {
                if (value3.x <= -40) {
                    CreateBackground(LastFloorBackground.right)
                    sprites.destroy(value3)
                }
            }
            for (let value22 of sprites.allOfKind(SpriteKind.Foreground)) {
                if (value22.x <= -40) {
                    CreateForeground(LastFloorForeground.right)
                    sprites.destroy(value22)
                }
            }
            pause(50)
        }
    })
}
function SetInputMode (Mode: string) {
    INPUT_MODE = Mode
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == INPUT_GAME && GAME_RUNNING) {
        DoAction(STATE_CASTING)
    }
})
function AddEntity (ID: number, Location: tiles.Location) {
    Entity = sprites.createProjectileFromSide(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, 0, 0)
    Entity.setKind(SpriteKind.Enemy)
    sprites.setDataBoolean(Entity, "IsAlive", true)
    sprites.setDataNumber(Entity, "ID", ID)
    sprites.setDataNumber(Entity, "Health", GetEntity_Health_Index(ID))
    sprites.setDataNumber(Entity, "MaxHealth", GetEntity_Health_Index(ID))
    sprites.setDataNumber(Entity, "AttackDamage", GetEntity_Attack_Damage(ID))
    Entity.setVelocity(GetEntity_Speed_Index(ID), 0)
    Entity.setStayInScreen(false)
    Entity.setFlag(SpriteFlag.GhostThroughWalls, true)
    Entity.setFlag(SpriteFlag.AutoDestroy, true)
    SB_ENTITY = statusbars.create(10, 3, StatusBarKind.Health)
    SB_ENTITY.attachToSprite(Entity, 0, 1)
    if (!(ID == 21)) {
        animation.runImageAnimation(
        Entity,
        GetEntity_Anim_IdleRun(ID),
        100,
        true
        )
        tiles.placeOnTile(Entity, tiles.getTileLocation(Location.column, Location.row))
    } else {
        CreatePetrifiedWither(Entity)
    }
}
function MENU_SAVE_LOAD_START () {
    bMenuOpen = true
    MENU_SAVELOAD = miniMenu.createMenuFromArray([
    miniMenu.createMenuItem("LEGEND " + "(Lv." + blockSettings.readNumberArray("save_1")[0] + ")", assets.image`icon_tear`),
    miniMenu.createMenuItem("SPACEMAN " + "(Lv." + blockSettings.readNumberArray("save_2")[0] + ")", assets.image`icon_space`),
    miniMenu.createMenuItem("KING " + "(Lv." + blockSettings.readNumberArray("save_3")[0] + ")", assets.image`icon_techno`),
    miniMenu.createMenuItem("HERO " + "(Lv." + blockSettings.readNumberArray("save_4")[0] + ")", assets.image`icon_hero`),
    miniMenu.createMenuItem("< CLOSE")
    ])
    miniMenu.onSelectionChanged(MENU_SAVELOAD, function (selection, selectedIndex) {
        music.play(music.createSoundEffect(WaveShape.Noise, 3900, 3500, 255, 0, 10, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    })
    MENU_SAVELOAD.z = 2000
    miniMenu.setDimensions(MENU_SAVELOAD, 128, 88)
    MENU_SAVELOAD.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
    miniMenu.setFrame(MENU_SAVELOAD, assets.image`lootReward9`)
    miniMenu.setMenuStyleProperty(MENU_SAVELOAD, miniMenu.MenuStyleProperty.Padding, 0)
    miniMenu.setStyleProperty(MENU_SAVELOAD, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 6)
    miniMenu.setStyleProperty(MENU_SAVELOAD, miniMenu.StyleKind.DefaultAndSelected, miniMenu.StyleProperty.Background, 8)
    miniMenu.setStyleProperty(MENU_SAVELOAD, miniMenu.StyleKind.Title, miniMenu.StyleProperty.Background, 6)
    miniMenu.setStyleProperty(MENU_SAVELOAD, miniMenu.StyleKind.Title, miniMenu.StyleProperty.Foreground, 5)
    miniMenu.setStyleProperty(MENU_SAVELOAD, miniMenu.StyleKind.Title, miniMenu.StyleProperty.Alignment, 1)
    miniMenu.setTitle(MENU_SAVELOAD, "SAVE OR LOAD GAME?")
    miniMenu.onButtonPressed(MENU_SAVELOAD, miniMenu.Button.A, function (selection, selectedIndex) {
        music.play(music.createSoundEffect(WaveShape.Square, 200, 600, 255, 0, 50, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
        if (!(selectedIndex == 4)) {
            MENU_SAVE_LOAD_NEXT(selection, selectedIndex)
            miniMenu.close(MENU_SAVELOAD)
        } else {
            miniMenu.close(MENU_SAVELOAD)
            pause(100)
            bMenuOpen = false
        }
    })
}
function GetDirectionalSprite (Angle: number, Projectile: string) {
    if (Projectile == "arrow") {
        if (Angle <= 90 && Angle > 82) {
            return assets.image`playerArrow2`
        }
        if (Angle <= 82 && Angle > 76) {
            return assets.image`playerArrow3`
        }
        if (Angle <= 76 && Angle > 68) {
            return assets.image`playerArrow4`
        }
        if (Angle <= 68 && Angle > 58) {
            return assets.image`playerArrow5`
        }
        if (Angle <= 58 && Angle > 50) {
            return assets.image`playerArrow6`
        }
        if (Angle <= 50 && Angle > 39) {
            return assets.image`playerArrow7`
        }
        if (Angle <= 39 && Angle > 32) {
            return assets.image`playerArrow8`
        }
        if (Angle <= 32 && Angle > 25) {
            return assets.image`playerArrow9`
        }
        if (Angle <= 25 && Angle > 14) {
            return assets.image`playerArrow10`
        } else {
            return assets.image`playerArrow11`
        }
    } else if (Projectile == "firework") {
        return img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `
    } else {
        return img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == INPUT_GAME && GAME_RUNNING) {
        DoAction(STATE_ULTIMATE)
    } else if (!(GAME_RUNNING) && !(GAME_INTRO_RUNNING)) {
        MENU_SAVE_LOAD_START()
    }
})
function DoDamage (Victim: Sprite, Instigator: Sprite) {
    if (Victim != Instigator) {
        if (Instigator.kind() == SpriteKind.Explosion) {
            sprites.setDataNumber(Victim, "Health", sprites.readDataNumber(Victim, "Health") - sprites.readDataNumber(Instigator, "BlastDamage"))
        } else if (Instigator.kind() == SpriteKind.Projectile) {
            sprites.setDataNumber(Victim, "Health", sprites.readDataNumber(Victim, "Health") - sprites.readDataNumber(Instigator, "ProjectileDamage"))
        } else {
            sprites.setDataNumber(Victim, "Health", sprites.readDataNumber(Victim, "Health") - sprites.readDataNumber(Instigator, "AttackDamage"))
        }
    }
    music.play(music.createSoundEffect(WaveShape.Square, 200, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
    if (Victim != Character) {
        animation.stopAnimation(animation.AnimationTypes.ImageAnimation, Victim)
        Victim.setImage(GetEntity_Frame_Hurt(sprites.readDataNumber(Victim, "ID")))
        Victim.vx += 200
        timer.after(IFrameDuration, function () {
            Victim.vx = GetEntity_Speed_Index(sprites.readDataNumber(Victim, "ID"))
            animation.runImageAnimation(
            Victim,
            GetEntity_Anim_IdleRun(sprites.readDataNumber(Victim, "ID")),
            100,
            true
            )
        })
    } else {
        scene.cameraShake(5, 200)
        Victim.setImage(assets.image`playerAnimations30`)
        timer.after(IFrameDuration, function () {
            animation.runImageAnimation(
            Victim,
            assets.animation`player_idlerun`,
            100,
            true
            )
        })
    }
    TryManageKilledEntity(Victim)
}
function CreatePetrifiedWither (Surrogate: Sprite) {
    animation.runImageAnimation(
    Surrogate,
    GetEntity_Anim_IdleRun(22),
    200,
    true
    )
    Surrogate.setFlag(SpriteFlag.GhostThroughWalls, true)
    Surrogate.z = 5
    Surrogate.setPosition(148, 68)
    Surrogate.vx = -10
    PetrifiedWither_Arms = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Effect)
    animation.runImageAnimation(
    PetrifiedWither_Arms,
    assets.animation`petrified_wither_walking_arms`,
    200,
    true
    )
    PetrifiedWither_Arms.setFlag(SpriteFlag.GhostThroughWalls, true)
    PetrifiedWither_Arms.setPosition(148, 68)
    PetrifiedWither_Arms.z = 10
    PetrifiedWither_Arms.vx = -10
    PetrifiedWither_Star = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Effect)
    animation.runImageAnimation(
    PetrifiedWither_Star,
    assets.animation`myAnim`,
    100,
    false
    )
    PetrifiedWither_Star.startEffect(effects.spray)
    PetrifiedWither_Star.setFlag(SpriteFlag.GhostThroughWalls, true)
    timer.background(function () {
        while (sprites.readDataBoolean(Surrogate, "IsAlive")) {
            PetrifiedWither_Star.setPosition(Surrogate.x + 7, Surrogate.y + 10)
            PetrifiedWither_Star.sx = randint(0.25, 3)
            PetrifiedWither_Star.sy = randint(0.25, 1.2)
            PetrifiedWither_Star.z = randint(1, 20)
            music.play(music.melodyPlayable(music.spooky), music.PlaybackMode.InBackground)
            pause(50)
        }
    })
    timer.background(function () {
        while (sprites.readDataBoolean(Surrogate, "IsAlive")) {
            scene.cameraShake(3, 100)
            music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.InBackground)
            if (Math.percentChance(33)) {
                music.play(music.createSoundEffect(WaveShape.Noise, 200, 200, 255, 0, 60, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.UntilDone)
                timer.after(60, function () {
                    music.play(music.createSoundEffect(WaveShape.Noise, 200, 200, 255, 0, 60, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                    timer.after(60, function () {
                        music.play(music.createSoundEffect(WaveShape.Noise, 200, 200, 255, 0, 60, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                    })
                })
            }
            pause(440)
        }
    })
}
function DATA_CHECK () {
    if (!(blockSettings.exists("save_1"))) {
        blockSettings.writeNumberArray("save_1", [0, 0])
        blockSettings.writeNumberArray("save_2", [0, 0])
        blockSettings.writeNumberArray("save_3", [0, 0])
        blockSettings.writeNumberArray("save_4", [0, 0])
    }
}
function DATA_SAVE (SaveFile: number) {
    blockSettings.writeNumberArray("save_" + SaveFile, [
    GAME_PLAYER_LEVEL,
    GAME_PLAYER_XP,
    0
    ])
}
function Play_Level (level: number) {
    LEVEL_BANNER = sprites.createProjectileFromSide(assets.image`level_banner_1`, -50, 0)
    tiles.placeOnTile(LEVEL_BANNER, tiles.getTileLocation(12, 4))
    LEVEL_BANNER.z = 20000
    LEVEL_BANNER.lifespan = 12000
    LEVEL_BANNER.setFlag(SpriteFlag.StayInScreen, false)
    LEVEL_BANNER.setFlag(SpriteFlag.GhostThroughWalls, true)
    LEVEL_BANNER.setFlag(SpriteFlag.AutoDestroy, false)
    timer.background(function () {
        for (let index = 0; index < 10; index++) {
            music.play(music.createSoundEffect(WaveShape.Square, 1724, 1, 255, 0, 300, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
            pause(300)
        }
    })
    timer.after(1000, function () {
        AddEntity(11, tiles.getTileLocation(10, 6))
    })
}
function UpdateStatusBars () {
    SB_Player_HP.max = sprites.readDataNumber(Character, "MaxHealth")
    SB_Player_HP.value = sprites.readDataNumber(Character, "Health")
    SB_Player_Mana.max = sprites.readDataNumber(Character, "MaxMana")
    SB_Player_Mana.value = sprites.readDataNumber(Character, "Mana")
    SB_Player_XP.max = GAME_PLAYER_XP_NEEDED
    SB_Player_XP.value = GAME_PLAYER_XP
    for (let value4 of statusbars.allOfKind(StatusBarKind.Health)) {
        value4.max = sprites.readDataNumber(value4.spriteAttachedTo(), "MaxHealth")
        value4.value = sprites.readDataNumber(value4.spriteAttachedTo(), "Health")
    }
}
function ShowSplashScreen () {
    ScrollingBackground(0, true)
    GAME_SPLASH_TEXT = textsprite.create([
    "FINN FOR THE WINN!",
    "MADE BY SENSEI SPENCER",
    "TRALSE? FLUE?",
    "BUTTER SQUISHY",
    "Will work for coffee",
    "GAME EDITION #2",
    "Check out the code!",
    "xTear's EPIC adventure!",
    "Void Venture, iykyk",
    "Can you find the duck?",
    "LEGENDARY PERFORMANCE",
    "Now with a FIRE STAFF!",
    "WELCOME PETRIFIED WITHER"
    ]._pickRandom(), 12, randint(1, 7))
    GAME_SPLASH_TEXT.setKind(SpriteKind.SplashScreen)
    GAME_SPLASH_TEXT.x = 80
    GAME_SPLASH_TEXT.y += -32
    GAME_LOGO = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.SplashScreen)
    GAME_PLAY_BUTTON = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.SplashScreen)
    GAME_PLAY_BUTTON.y += 28
    GAME_LOGO.setFlag(SpriteFlag.Invisible, true)
    GAME_PLAY_BUTTON.setFlag(SpriteFlag.Invisible, true)
    animation.runMovementAnimation(
    GAME_SPLASH_TEXT,
    animation.animationPresets(animation.bobbing),
    2000,
    true
    )
    animation.runMovementAnimation(
    GAME_LOGO,
    animation.animationPresets(animation.bobbing),
    2000,
    true
    )
    animation.runMovementAnimation(
    GAME_PLAY_BUTTON,
    animation.animationPresets(animation.bobbing),
    2000,
    true
    )
    animation.runImageAnimation(
    GAME_LOGO,
    assets.animation`LogoAnim`,
    650,
    true
    )
    animation.runImageAnimation(
    GAME_PLAY_BUTTON,
    assets.animation`pressAToStartAnim`,
    650,
    true
    )
    timer.after(1, function () {
        GAME_LOGO.setFlag(SpriteFlag.Invisible, false)
        GAME_PLAY_BUTTON.setFlag(SpriteFlag.Invisible, false)
    })
    timer.background(function () {
        while (!(GAME_RUNNING) && !(GAME_INTRO_RUNNING)) {
            Entity = sprites.createProjectileFromSide(img`
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                `, 0, 0)
            tiles.placeOnTile(Entity, tiles.getTileLocation(10, 6))
            animation.runImageAnimation(
            Entity,
            ENTITY_ANIM_IDLERUN[randint(0, 2)]._pickRandom(),
            100,
            true
            )
            Entity.setKind(SpriteKind.SplashScreen)
            Entity.setVelocity(-50, 0)
            Entity.top = 100
            pause(randint(600, 800))
        }
    })
}
function GetEntity_Frame_Hurt (ID: number) {
    return ENTITY_HURT_FRAME[parseFloat(convertToText(ID).substr(0, 1)) - 1][parseFloat(convertToText(ID).substr(1, convertToText(ID).length - 1)) - 1]
}
function MENU_SAVE_LOAD_NEXT (Save: string, Index: number) {
    MENU_SELECT_OPTION = miniMenu.createMenuFromArray([
    miniMenu.createMenuItem(Save, miniMenu.getMenuItem(MENU_SAVELOAD, Index).getIcon(), true),
    miniMenu.createMenuItem("LOAD SAVE?"),
    miniMenu.createMenuItem("OVERWRITE?"),
    miniMenu.createMenuItem("< BACK")
    ])
    miniMenu.onSelectionChanged(MENU_SELECT_OPTION, function (selection, selectedIndex) {
        music.play(music.createSoundEffect(WaveShape.Noise, 3900, 3500, 255, 255, 10, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
    })
    miniMenu.setTitle(MENU_SELECT_OPTION, "SAVE FILE READY!")
    miniMenu.setStyleProperty(MENU_SELECT_OPTION, miniMenu.StyleKind.Title, miniMenu.StyleProperty.Background, 9)
    miniMenu.setStyleProperty(MENU_SELECT_OPTION, miniMenu.StyleKind.Title, miniMenu.StyleProperty.Foreground, 15)
    miniMenu.setStyleProperty(MENU_SELECT_OPTION, miniMenu.StyleKind.Title, miniMenu.StyleProperty.Alignment, 1)
    miniMenu.setStyleProperty(MENU_SELECT_OPTION, miniMenu.StyleKind.Disabled, miniMenu.StyleProperty.Background, 10)
    miniMenu.setStyleProperty(MENU_SELECT_OPTION, miniMenu.StyleKind.Disabled, miniMenu.StyleProperty.Foreground, 9)
    miniMenu.setStyleProperty(MENU_SELECT_OPTION, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 6)
    miniMenu.setStyleProperty(MENU_SELECT_OPTION, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 1)
    miniMenu.setStyleProperty(MENU_SELECT_OPTION, miniMenu.StyleKind.DefaultAndSelected, miniMenu.StyleProperty.Background, 1)
    miniMenu.setFrame(MENU_SELECT_OPTION, assets.image`lootReward18`)
    MENU_SELECT_OPTION.z = 3000
    miniMenu.setDimensions(MENU_SELECT_OPTION, 124, 76)
    MENU_SELECT_OPTION.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
    miniMenu.onButtonPressed(MENU_SELECT_OPTION, miniMenu.Button.A, function (selection, selectedIndex) {
        music.play(music.createSoundEffect(WaveShape.Square, 200, 600, 255, 255, 50, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
        miniMenu.close(MENU_SELECT_OPTION)
        if (selectedIndex == 1) {
            music.play(music.createSong(hex`00dc000408010105001c000f0a006400f4010a0000040000000000000000000000000000000002180000000200010d02000400010f04000600010c060008000118`), music.PlaybackMode.InBackground)
            MENU_SHOW_SUCCESS = miniMenu.createMenu(
            miniMenu.createMenuItem("OK >")
            )
            MENU_SHOW_SUCCESS.z = 3200
            miniMenu.setDimensions(MENU_SHOW_SUCCESS, 96, 34)
            MENU_SHOW_SUCCESS.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
            miniMenu.setTitle(MENU_SHOW_SUCCESS, "SAVE LOADED.")
            miniMenu.setFrame(MENU_SHOW_SUCCESS, assets.image`lootReward27`)
            miniMenu.onButtonPressed(MENU_SHOW_SUCCESS, miniMenu.Button.A, function (selection, selectedIndex) {
                miniMenu.close(MENU_SHOW_SUCCESS)
            })
        }
        if (selectedIndex == 3) {
            MENU_SAVE_LOAD_START()
        }
    })
}
function SetLevelText () {
    TEXT_CHARACTER_LEVEL.setText("Lv" + GAME_PLAYER_LEVEL)
}
function InventorySlotManager () {
    for (let index2 = 0; index2 <= 7; index2++) {
        Slot = sprites.createProjectileFromSide(assets.image`Slot`, 0, 0)
        Slot.setKind(SpriteKind.InventorySlot)
        Slot.setPosition(scene.cameraProperty(CameraProperty.Left) + (7 + 11 * index2), scene.cameraProperty(CameraProperty.Bottom) - 7)
        sprites.setDataNumber(Slot, "Slot", index2 + 1)
        Slot.z = 10
    }
}
function StartingConstruction () {
    EXPLOSION_TNT = "TNT"
    EXPLOSION_MAGIC = "MAGIC"
    EXPLOSION_FIREBALL = "FIREBALL"
    INPUT_LOCKED = "INPUT_UI"
    INPUT_GAME = "INPUT_GAME"
    INPUT_MODE = INPUT_GAME
    STATE_JUMP = "Jump"
    STATE_ATTACK = "Attack"
    STATE_BLOCKING = "Blocking"
    STATE_AIMING = "Aiming"
    STATE_CASTING = "Casting"
    STATE_ULTIMATE = "Ultimate"
    STATE_IDLERUN = "IdleRun"
    IFrameDuration = 50
    GAME_PLAYER_XP_NEEDED = 600
    ENTITY_ANIM_IDLERUN = [[
    assets.animation`zombie_idle`,
    assets.animation`zombie_gold_idle`,
    assets.animation`zombie_iron_idle`,
    assets.animation`zombie_diamond_idle`,
    assets.animation`mobAnimation15`,
    assets.animation`skeleton_idle`,
    assets.animation`skeleton_gold_idle`,
    assets.animation`skeleton_iron_idle`,
    assets.animation`skeleton_diamond_idle`,
    assets.animation`mobAnimation23`,
    assets.animation`hexxus_idle`,
    assets.animation`spider_idle`,
    assets.animation`spider_jockey_idle`,
    assets.animation`spider_giant_idle`,
    assets.animation`creeper_idle`,
    assets.animation`creeper_charged_idle`,
    assets.animation`mobAnimation17`,
    assets.animation`creeper_flying_machine_idle`,
    assets.animation`creeper_giant_idle`
    ], [
    assets.animation`mobAnimation24`,
    assets.animation`mobAnimation25`,
    assets.animation`mobAnimation26`,
    assets.animation`mobAnimation27`,
    assets.animation`mobAnimation28`,
    assets.animation`mobAnimation29`,
    assets.animation`mobAnimation30`,
    assets.animation`mobAnimation31`,
    assets.animation`mobAnimation32`,
    assets.animation`mobAnimation33`,
    assets.animation`mobAnimation34`,
    assets.animation`mobAnimation40`,
    assets.animation`mobAnimation41`,
    assets.animation`mobAnimation36`,
    assets.animation`mobAnimation35`,
    assets.animation`mobAnimation37`,
    assets.animation`mobAnimation38`,
    assets.animation`mobAnimation39`,
    assets.animation`mobAnimation42`,
    assets.animation`mobAnimation43`,
    assets.animation`mobAnimation44`,
    assets.animation`petrified_wither_dragging_head`,
    assets.animation`petrified_wither_roar_head`,
    assets.animation`petrified_wither_walking_arms`,
    assets.animation`myAnim`
    ], [
    assets.animation`mobHurtAnim`,
    assets.animation`mobHurtAnim2`,
    assets.animation`constructArrays2`,
    assets.animation`constructArrays2`
    ]]
    ENTITY_HURT_FRAME = [[
    assets.image`mobHurt`,
    assets.image`mobHurt2`,
    assets.image`mobHurt3`,
    assets.image`mobHurt4`
    ], [
    img`
        ...........................................................................
        ...........................................................................
        ...........................................................................
        ...........................................................................
        ...........................................................................
        ...........................................c...............................
        .........................................cc..........c.....................
        ....................................c...c.c.....c...c......................
        ...................................c...cc.c.a.cc....c......................
        ................................aa.cccc...c.acca..c.c......................
        ...............................a.aa.accacc.aaca..c.c.......................
        ..............................ca.ca.ac.cc.ca.ca..c.c.......................
        .............................cacacacacccccaccac.ccc........................
        ..............................cca.aca.ccccaccacaacca.......................
        ..............................ccaaacaccaaaaaccaacca........................
        ..............................ccaaaaaaaaccaacacacaa.a......................
        ...............................f99faaff99fcaaaacac.a.....c.................
        ...............................f99faaff99fcacaca.ca.....c..................
        ...............................f11fcaff11fcacaacc.c.....cc.c...............
        ...............................acccfbcccccaaaaa.cac....accc................
        ...............................bbbbfbccbbbbaaacca...a..cccc................
        ...................c.c.........abfbfbfffbfbaaa.ca...a.caccc.a..............
        ....................cc.........abfffffffbfbcaaaa....acaccaaaa..............
        ....................cccc...c...fffffffffffbcffac..aaaacccaaa...............
        ......................c.c..ff.....fffffffffffffaaafccacaaaf................
        .......................ccca.cf.c..fffffffffffffaaaffcaaaaa9................
        .......................cccc.cffc...fffffffffffcaaaffcccfaaa...c............
        .....................a.cccacccf...bfffffffffffbcaafccccfabb..c.............
        .....................aaaaccacccc..bcfffffbffbfbccbfcccfbc.c.c..............
        ......................aaacccacfccf.bfcbffbfbbaaaabffcccffc.c...............
        .......................faaacccffcf.bbcbccbcffbbbaffffbccfbc................
        .......................9aaaacccfccfccccaccabbbbbbabcbccfbc....c............
        .......................aaafcccffcffbbaaccffffffbbaa.cfffc....c.............
        .......................bbafcccffffbbaaccf.....ffbbacfff.c..cc..............
        .......................c.cbfcccfffbbaac........ffbacccffc.c..cc............
        ........................cffccccfcfbbaac........bbbacccafcc.cc..............
        ........................bfcc.cfff.bbaac.......bbb.acfcc.acc................
        .........................c...ffff.bbbbbbb........aacfcc....................
        ...............................fffbbbbaaa........afcf.c....................
        ...............................f.ccccaaaaa.f...aaacff......................
        ................................f.cccfcaaaaf..fffcfff......................
        ...............................c.ffcfffcfffff.ffcfcf.......................
        ..................................ffcfffcff.f.ffcf.........................
        ..................................ccffffc.fff.ff...........................
        .................................c.cfff..cccf.ff...........................
        ................................c.c.fff.cc.cff.f...........................
        ...............................c.fc.ff..c...fffccc.........................
        ................................fc..ff.......fffc..........................
        .................................c...f........ffff.cc......................
        ................................c...f.........ccffcc.......................
        .............................................cc...fff......................
        ...........................................................................
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `
    ], [
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `
    ]]
    ENTITY_HEALTH_INDEX = [[
    20,
    20,
    20,
    20
    ], [
    20,
    20,
    20,
    20
    ], [
    20,
    20,
    20,
    20
    ]]
    ENTITY_SPEED_INDEX = [[
    40,
    40,
    40,
    40
    ], [
    40,
    40,
    40,
    40
    ], [
    40,
    40,
    40,
    40
    ]]
    ENTITY_ATTACK_DAMAGE = [[
    10,
    10,
    10,
    10
    ], [
    10,
    10,
    10,
    10
    ], [
    10,
    10,
    10,
    10
    ]]
}
function AddVectorFireball (Instigator: Sprite, x: number, y: number, AccuracySpread: number) {
    Fireball = sprites.createProjectileFromSprite(assets.image`Fireball`, Instigator, 0, 0)
    sprites.setDataSprite(Fireball, "Instigator", Instigator)
    sprites.setDataString(Fireball, "ProjectileType", "PROJECTILE_FIREBALL")
    sprites.setDataNumber(Fireball, "BlastDamage", 12)
    Fireball.setFlag(SpriteFlag.StayInScreen, false)
    ProjectileDX = x - Instigator.x + randint(-1 * AccuracySpread, AccuracySpread)
    ProjectileDY = y - Instigator.y + randint(-1 * AccuracySpread, AccuracySpread)
    Fireball.vx = 100 * (ProjectileDX / GetDistance(Instigator.x, x, Instigator.y, y))
    Fireball.vy = 100 * (ProjectileDY / GetDistance(Instigator.x, x, Instigator.y, y))
    Fireball.ay = 10
    Fireball.lifespan = 2000
    Fireball.z = 20
    Fireball.scale = 0.5
    Fireball.startEffect(effects.fire, 2000)
    music.play(music.createSoundEffect(WaveShape.Noise, 1, 1631, 255, 0, 150, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
}
function HasState (State: string) {
    return CharacterStates.indexOf(State) >= 0
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Explosion, function (sprite, otherSprite) {
    DoDamage(sprite, otherSprite)
})
function XPLevelUpManager () {
    GAME_PLAYER_XP_NEEDED = Math.round(1200 * 1.1 ** (GAME_PLAYER_LEVEL - 1))
    if (GAME_PLAYER_XP > GAME_PLAYER_XP_NEEDED) {
        GAME_PLAYER_XP += GAME_PLAYER_XP_NEEDED * -1
        GAME_PLAYER_LEVEL += 1
        LevelUps += 1
        SetLevelText()
        music.play(music.createSong(assets.song`SFX_LevelUP`), music.PlaybackMode.InBackground)
        effects.confetti.startScreenEffect(1000)
    }
}
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (Character.isHittingTile(CollisionDirection.Bottom) && HasState(STATE_JUMP)) {
        RemoveState(STATE_JUMP)
    }
})
function AddVectorEffect (Type: string, Instigator: Sprite, Target: Sprite, AccuracyRange: number) {
	
}
function AddState (State: string, SelfMutex: boolean, MutexStates: string[], AddFirst: boolean) {
    if (HasState(STATE_IDLERUN)) {
        CharacterStates.removeAt(CharacterStates.indexOf(STATE_IDLERUN))
    }
    for (let index22 = 0; index22 <= CharacterStates.length - 1; index22++) {
        if (MutexStates.indexOf(CharacterStates[index22]) >= 0 || (SelfMutex && CharacterStates[index22]) == State) {
            CharacterStates.removeAt(index22)
        }
    }
    if (AddFirst) {
        CharacterStates.unshift(State)
    } else {
        CharacterStates.push(State)
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == INPUT_GAME && GAME_RUNNING) {
        DoAction(STATE_BLOCKING)
    }
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Enemy, function (sprite, otherSprite) {
    otherSprite.x += 1
})
function PlayCheckedTimedStateAnimation (AnimationDuration: number, RemoveState2: boolean) {
    if (CharacterStates[0] == STATE_ATTACK) {
        animation.runImageAnimation(
        Character,
        assets.animation`player_attack`,
        50,
        false
        )
    }
    if (CharacterStates[0] == STATE_AIMING) {
        animation.runImageAnimation(
        Character,
        assets.animation`player_aiming`,
        100,
        true
        )
    }
    if (CharacterStates[0] == STATE_BLOCKING) {
        animation.runImageAnimation(
        Character,
        assets.animation`player_blocking`,
        100,
        true
        )
    }
    if (CharacterStates[0] == STATE_IDLERUN) {
        animation.runImageAnimation(
        Character,
        assets.animation`player_idlerun`,
        175,
        true
        )
    }
    if (CharacterStates[0] == STATE_JUMP) {
        animation.runImageAnimation(
        Character,
        assets.animation`player_jump`,
        100,
        false
        )
    }
    if (CharacterStates[0] == STATE_CASTING) {
        animation.runImageAnimation(
        Character,
        assets.animation`player_casting`,
        100,
        true
        )
    }
    if (CharacterStates[0] == STATE_ULTIMATE) {
        animation.runImageAnimation(
        Character,
        assets.animation`player_ultimate`,
        100,
        true
        )
    }
    if (RemoveState2) {
        timer.after(AnimationDuration, function () {
            RemoveState(CharacterStates[0])
        })
    }
}
function TryManageKilledEntity (DeceasedEntity: Sprite) {
    if (sprites.readDataNumber(DeceasedEntity, "Health") <= 0 && !(DeceasedEntity == Character) && sprites.readDataBoolean(DeceasedEntity, "IsAlive")) {
        sprites.setDataBoolean(DeceasedEntity, "IsAlive", false)
        info.changeScoreBy(10 * sprites.readDataNumber(DeceasedEntity, "MaxHealth"))
        GAME_PLAYER_XP += 10 * sprites.readDataNumber(DeceasedEntity, "MaxHealth")
        sprites.destroy(DeceasedEntity, effects.disintegrate, 100)
        XPLevelUpManager()
    }
}
function GetEntity_Anim_IdleRun (ID: number) {
    return ENTITY_ANIM_IDLERUN[parseFloat(convertToText(ID).substr(0, 1)) - 1][parseFloat(convertToText(ID).substr(1, convertToText(ID).length - 1)) - 1]
}
function RemoveState (State: string) {
    j = CharacterStates.indexOf(State)
    if (j >= 0) {
        CharacterStates.removeAt(j)
    }
    if (CharacterStates.length == 0) {
        AddState(STATE_IDLERUN, true, [], false)
    }
    PlayCheckedTimedStateAnimation(0, false)
}
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    if (INPUT_MODE == INPUT_GAME && GAME_RUNNING) {
        if (!(HasState(STATE_ULTIMATE))) {
            RemoveState(STATE_BLOCKING)
        }
    }
})
function GetEntity_Attack_Damage (ID: number) {
    return ENTITY_ATTACK_DAMAGE[parseFloat(convertToText(ID).substr(0, 1)) - 1][parseFloat(convertToText(ID).substr(1, convertToText(ID).length - 1)) - 1]
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Player, function (sprite, otherSprite) {
    if (sprites.readDataString(sprite, "ProjectileType") == "PROJECTILE_FIREBALL") {
        if (!(sprites.readDataSprite(sprite, "Instigator") == otherSprite)) {
            AddExplosion(EXPLOSION_FIREBALL, 2, 3, sprite.x, sprite.y, sprite)
            sprites.destroy(sprite)
        }
    }
})
function GetEntity_Speed_Index (ID: number) {
    return ENTITY_SPEED_INDEX[parseFloat(convertToText(ID).substr(0, 1)) - 1][parseFloat(convertToText(ID).substr(1, convertToText(ID).length - 1)) - 1] * -1
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == INPUT_GAME && GAME_RUNNING) {
        DoAction(STATE_JUMP)
    }
})
function AimingBow (_true: boolean) {
    if (_true && GAME_RUNNING) {
        angle = 0
        BOW_CHARGE = 0
        RANGED_WEAPON_CONTROL = 2
        RANGED_WEAPON_RETICLE = sprites.create(assets.image`chargeDot4`, SpriteKind.Effect)
        timer.background(function () {
            while (controller.down.isPressed()) {
                BOW_CHARGE += 25
                if (controller.up.isPressed()) {
                    angle = Math.min(angle + RANGED_WEAPON_CONTROL, 90)
                } else {
                    angle = Math.max(0, angle - RANGED_WEAPON_CONTROL)
                }
                if (BOW_CHARGE >= 500) {
                    RETICLE_RADIUS = 90
                    RANGED_WEAPON_RETICLE.setImage(assets.image`chargeDot`)
                } else {
                    if (BOW_CHARGE >= 375) {
                        RETICLE_RADIUS = 78
                        RANGED_WEAPON_RETICLE.setImage(assets.image`chargeDot2`)
                    } else {
                        if (BOW_CHARGE >= 175) {
                            RETICLE_RADIUS = 60
                            RANGED_WEAPON_RETICLE.setImage(assets.image`chargeDot3`)
                        } else {
                            RETICLE_RADIUS = 50
                        }
                    }
                }
                RANGED_WEAPON_RETICLE.x = Character.x + RETICLE_RADIUS * Math.cos(angle * Math.PI / 180)
                RANGED_WEAPON_RETICLE.y = Character.y - RETICLE_RADIUS * Math.sin(angle * Math.PI / 180)
                pause(25)
            }
        })
    } else {
        sprites.destroy(RANGED_WEAPON_RETICLE)
        if (BOW_CHARGE >= 200) {
            music.play(music.createSoundEffect(WaveShape.Noise, 2365, 4651, 255, 0, 200, SoundExpressionEffect.Warble, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
            arrow = sprites.create(GetDirectionalSprite(angle, "arrow"), SpriteKind.Projectile)
            sprites.setDataNumber(arrow, "ProjectileDamage", Math.max(BOW_CHARGE, 500) / 500 * sprites.readDataNumber(Character, "BowDamage"))
            sprites.setDataString(arrow, "ProjectileType", "PROJECTILE_ARROW")
            arrow.setPosition(Character.x, Character.y)
            PlayerArrowDX = Character.x + RETICLE_RADIUS * Math.cos(angle * Math.PI / 180) - Character.x
            PlayerArrowDY = Character.y - RETICLE_RADIUS * Math.sin(angle * Math.PI / 180) - Character.y
            PlayerArrowDistance = Math.sqrt(PlayerArrowDX * PlayerArrowDX + PlayerArrowDY * PlayerArrowDY)
            arrow.vx = Math.max(BOW_CHARGE, 600) / 600 * (PlayerArrowDX / (PlayerArrowDistance * 0.004))
            arrow.vy = Math.max(BOW_CHARGE, 600) / 600 * (PlayerArrowDY / (PlayerArrowDistance * 0.004))
            arrow.lifespan = 2000
            arrow.setFlag(SpriteFlag.GhostThroughWalls, true)
            arrow.ay = 200
        }
        angle = 0
        BOW_CHARGE = 0
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == INPUT_GAME && GAME_RUNNING) {
        DoAction(STATE_ATTACK)
    }
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Explosion, function (sprite, otherSprite) {
    DoDamage(sprite, otherSprite)
})
function ChargeAndReleaseUltimate () {
    ULTIMATE_CHARGE = 0
    while (HasState(STATE_ULTIMATE)) {
        ULTIMATE_CHARGE += 20
        if (ULTIMATE_CHARGE == 800) {
            animation.runImageAnimation(
            Character,
            assets.animation`playerAnimations5`,
            100,
            true
            )
        }
        if (ULTIMATE_CHARGE == 1600) {
            animation.runImageAnimation(
            Character,
            assets.animation`playerAnimations6`,
            100,
            true
            )
        }
        pause(20)
    }
    if (ULTIMATE_CHARGE > 800) {
        SetInputMode(INPUT_LOCKED)
        music.play(music.createSoundEffect(WaveShape.Noise, 1105, 1, 195, 255, 1250, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
        animation.runImageAnimation(
        Character,
        assets.animation`player_ultimate_in_air`,
        325,
        false
        )
        Character.y += -20
        timer.after(20, function () {
            Character.vy = -250
            Character.vx = 20
            Character.ax = -75
            timer.after(60, function () {
                Character.vx = 100
            })
        })
        timer.after(200, function () {
            pauseUntil(() => Character.isHittingTile(CollisionDirection.Bottom))
            music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.InBackground)
            music.play(music.melodyPlayable(music.smallCrash), music.PlaybackMode.InBackground)
            music.play(music.melodyPlayable(music.zapped), music.PlaybackMode.InBackground)
            music.play(music.createSoundEffect(WaveShape.Noise, 1825, 1, 255, 0, 200, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
            animation.runImageAnimation(
            Character,
            assets.animation`playerAnimations3`,
            100,
            false
            )
            scene.cameraShake(ULTIMATE_CHARGE / 200, 300)
            Character.vx = 0
            Character.ax = 0
            AddExplosion(EXPLOSION_MAGIC, 1, 20, Character.x, Character.y, Character)
            timer.after(400, function () {
                animation.runImageAnimation(
                Character,
                assets.animation`player_ultimate`,
                50,
                true
                )
                while (!(Character.x < 42)) {
                    Character.x += -2
                    pause(20)
                }
                SetInputMode(INPUT_GAME)
                RemoveState(STATE_IDLERUN)
            })
        })
    }
}
function LevelCompleted () {
	
}
function GetEntity_Health_Index (ID: number) {
    return ENTITY_HEALTH_INDEX[parseFloat(convertToText(ID).substr(0, 1)) - 1][parseFloat(convertToText(ID).substr(1, convertToText(ID).length - 1)) - 1]
}
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    if (sprites.readDataString(sprite, "ProjectileType") == "PROJECTILE_FIREBALL") {
        AddExplosion(EXPLOSION_FIREBALL, 2, 3, sprite.x, sprite.y, sprites.readDataSprite(sprite, "Instigator"))
        sprites.destroy(sprite)
    }
})
function Cutscene (Scene: number) {
    if (Scene == 0) {
        music.play(music.createSoundEffect(WaveShape.Noise, 3900, 3500, 255, 0, 10, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
        color.FadeToBlack.startScreenEffect(1000)
        color.pauseUntilFadeDone()
        GAME_INTRO_RUNNING = true
        sprites.destroyAllSpritesOfKind(SpriteKind.SplashScreen)
        sprites.destroyAllSpritesOfKind(SpriteKind.Background)
        sprites.destroyAllSpritesOfKind(SpriteKind.Foreground)
        tiles.setCurrentTilemap(tilemap`level2`)
        music.play(music.createSong(assets.song`song_intro3`), music.PlaybackMode.InBackground)
        color.clearFadeEffect()
        textSprite = textsprite.create("DO YOU WISH TO BE A HERO?", 15, 2)
        textSprite.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
        timer.after(500, function () {
            color.FadeToBlack.startScreenEffect(500)
            timer.after(500, function () {
                color.clearFadeEffect()
                timer.after(500, function () {
                    color.FadeToBlack.startScreenEffect(500)
                    timer.after(500, function () {
                        color.clearFadeEffect()
                        timer.after(500, function () {
                            color.FadeToBlack.startScreenEffect(500)
                            timer.after(500, function () {
                                color.clearFadeEffect()
                                timer.after(500, function () {
                                    color.FadeToBlack.startScreenEffect(500)
                                    timer.after(500, function () {
                                        color.clearFadeEffect()
                                        music.play(music.createSong(assets.song`song_intro0`), music.PlaybackMode.InBackground)
                                        sprites.destroy(textSprite)
                                        textSprite = textsprite.create("DO YOU HAVE WHAT IT TAKES?", 15, 3)
                                        textSprite.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
                                        timer.after(500, function () {
                                            color.FadeToBlack.startScreenEffect(500)
                                            timer.after(500, function () {
                                                color.clearFadeEffect()
                                                timer.after(500, function () {
                                                    color.FadeToBlack.startScreenEffect(500)
                                                    timer.after(500, function () {
                                                        color.clearFadeEffect()
                                                        timer.after(500, function () {
                                                            color.FadeToBlack.startScreenEffect(500)
                                                            timer.after(500, function () {
                                                                timer.background(function () {
                                                                    music.play(music.createSong(assets.song`intro_song1`), music.PlaybackMode.UntilDone)
                                                                    timer.background(function () {
                                                                        music.play(music.createSong(assets.song`intro_song2`), music.PlaybackMode.UntilDone)
                                                                    })
                                                                })
                                                                color.clearFadeEffect()
                                                                sprites.destroy(textSprite)
                                                                textSprite = textsprite.create("GET READY...", 15, 5)
                                                                textSprite.setMaxFontHeight(9)
                                                                textSprite.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
                                                                timer.after(500, function () {
                                                                    color.FadeToBlack.startScreenEffect(500)
                                                                    timer.after(500, function () {
                                                                        color.clearFadeEffect()
                                                                        timer.after(500, function () {
                                                                            color.FadeToBlack.startScreenEffect(500)
                                                                            timer.after(500, function () {
                                                                                color.clearFadeEffect()
                                                                                timer.after(500, function () {
                                                                                    color.FadeToBlack.startScreenEffect(500)
                                                                                    timer.after(500, function () {
                                                                                        sprites.destroy(textSprite)
                                                                                        ScrollingBackground(0, true)
                                                                                        tiles.setCurrentTilemap(tilemap`overworld_intro`)
                                                                                        Character = sprites.create(assets.image`xtear_sprite`, SpriteKind.SplashScreen)
                                                                                        tiles.placeOnTile(Character, tiles.getTileLocation(0, 6))
                                                                                        color.clearFadeEffect()
                                                                                        Character.vx = 20
                                                                                        timer.after(1000, function () {
                                                                                            Character.vx = 12
                                                                                            timer.after(750, function () {
                                                                                                Character.vx = 8
                                                                                                timer.after(500, function () {
                                                                                                    Character.vx = 4
                                                                                                })
                                                                                            })
                                                                                        })
                                                                                        Character.y += 1
                                                                                        animation.runImageAnimation(
                                                                                        Character,
                                                                                        assets.animation`player_running`,
                                                                                        100,
                                                                                        true
                                                                                        )
                                                                                        timer.background(function () {
                                                                                            pauseUntil(() => Character.isHittingTile(CollisionDirection.Right))
                                                                                            Character.vx = 0
                                                                                            tiles.setCurrentTilemap(tilemap`overworld_tilemap`)
                                                                                        })
                                                                                        scene.cameraShake(8, 200)
                                                                                        sprites.destroy(textSprite)
                                                                                        textSprite = textsprite.create("USE KEYS & BUTTONS!", 0, 1)
                                                                                        textSprite.setMaxFontHeight(8)
                                                                                        textSprite.setOutline(1, 15)
                                                                                        textSprite.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y) - 25)
                                                                                        Instructions = sprites.create(assets.image`GameIntro2`, SpriteKind.SplashScreen)
                                                                                        Instructions.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
                                                                                        animation.runMovementAnimation(
                                                                                        Instructions,
                                                                                        animation.animationPresets(animation.bobbing),
                                                                                        2000,
                                                                                        true
                                                                                        )
                                                                                        timer.after(3000, function () {
                                                                                            Instructions.setImage(assets.image`lootReward6`)
                                                                                            scene.cameraShake(8, 200)
                                                                                            timer.after(3000, function () {
                                                                                                Instructions.setImage(assets.image`GameIntro3`)
                                                                                                scene.cameraShake(8, 200)
                                                                                                timer.after(3000, function () {
                                                                                                    Instructions.setImage(assets.image`lootReward10`)
                                                                                                    scene.cameraShake(8, 200)
                                                                                                    timer.after(3000, function () {
                                                                                                        scene.cameraShake(4, 500)
                                                                                                        sprites.destroy(Instructions)
                                                                                                        textSprite.setText("GOOD LUCK")
                                                                                                        textSprite.lifespan = 7000
                                                                                                        textSprite.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y))
                                                                                                        timer.after(2000, function () {
                                                                                                            textSprite.vx = 40
                                                                                                            textSprite.ax = -40
                                                                                                            timer.after(5000, function () {
                                                                                                                GAME_INTRO_RUNNING = false
                                                                                                                sprites.destroyAllSpritesOfKind(SpriteKind.SplashScreen)
                                                                                                                sprites.destroyAllSpritesOfKind(SpriteKind.SplashScreen)
                                                                                                                scene.cameraShake(6, 100)
                                                                                                            })
                                                                                                        })
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
        pauseUntil(() => !(GAME_INTRO_RUNNING))
    }
}
function GetClosestLivingEntity () {
    ClosestEnemy = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Effect)
    ClosestEnemyDistance = 200
    for (let value42 of sprites.allOfKind(SpriteKind.Enemy)) {
        if (GetDistance(Character.x, value42.x, Character.y, value42.y) < ClosestEnemyDistance) {
            if (sprites.readDataBoolean(value42, "IsAlive")) {
                ClosestEnemyDistance = GetDistance(Character.x, value42.x, Character.y, value42.y)
                ClosestEnemy = value42
            }
        }
        if (sprites.allOfKind(SpriteKind.Enemy).indexOf(value42) == sprites.allOfKind(SpriteKind.Enemy).length - 1) {
            console.log("Found last enemy.")
            return true
        }
    }
    console.log("No last enemy.")
    return false
}
function CreatePlayerComponent () {
    GAME_PLAYER_LEVEL = 1
    Character = sprites.create(assets.image`xtear_sprite`, SpriteKind.Player)
    tiles.placeOnTile(Character, tiles.getTileLocation(2, 6))
    Character.ay = 400
    CharacterStates = []
    sprites.setDataNumber(Character, "Health", 50)
    sprites.setDataNumber(Character, "MaxHealth", 50)
    sprites.setDataNumber(Character, "MaxMana", 100)
    sprites.setDataNumber(Character, "Mana", 100)
    sprites.setDataNumber(Character, "XP", 0)
    SetupStatusBars()
    animation.runImageAnimation(
    Character,
    assets.animation`player_idlerun`,
    175,
    true
    )
    sprites.setDataNumber(Character, "AttackDamage", 7)
    sprites.setDataNumber(Character, "BowDamage", 9)
    Character_Shield = sprites.create(assets.image`player_shield`, SpriteKind.Effect)
    Character_Shield.setFlag(SpriteFlag.Invisible, true)
    Character_Shield.setPosition(Character.x + 6, Character.y)
    Character_Bow = sprites.create(assets.image`player_bow`, SpriteKind.Effect)
    Character_Bow.setFlag(SpriteFlag.Invisible, true)
    Character_Bow.setPosition(Character.x + 2, Character.y)
    timer.background(function () {
        while (true) {
            PLAYER_PASSIVE_REGENERATION()
            pause(100)
        }
    })
}
function CreateBackground (num: number) {
    LastCeilingBackground = sprites.create(Backdrops[1][0]._pickRandom(), SpriteKind.Background)
    LastCeilingBackground.setFlag(SpriteFlag.Ghost, true)
    LastCeilingBackground.setFlag(SpriteFlag.AutoDestroy, true)
    LastCeilingBackground.bottom = scene.screenHeight() - 88
    LastCeilingBackground.left = num
    LastCeilingBackground.z = -101
    LastFloorBackground = sprites.create(Backdrops[1][1]._pickRandom(), SpriteKind.Background)
    LastFloorBackground.setFlag(SpriteFlag.Ghost, true)
    LastFloorBackground.setFlag(SpriteFlag.AutoDestroy, true)
    LastFloorBackground.bottom = scene.screenHeight() - 8
    LastFloorBackground.left = num
    LastFloorBackground.z = -101
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == INPUT_GAME && GAME_RUNNING) {
        DoAction(STATE_AIMING)
    }
})
function GetDistance (x1: number, x2: number, y1: number, y2: number) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    SetInputMode(INPUT_LOCKED)
    myMenu = miniMenu.createMenuFromArray([miniMenu.createMenuItem("[BUY] $1M", assets.image`lootReward27`)])
    miniMenu.setStyleProperty(myMenu, miniMenu.StyleKind.Default, miniMenu.StyleProperty.IconOnly, 1)
    miniMenu.setFrame(myMenu, assets.image`lootReward27`)
})
function DoAction (Action: string) {
    if (!(HasState(STATE_ULTIMATE)) && GAME_RUNNING) {
        if (!(HasState(STATE_CASTING))) {
            if (Action == STATE_CASTING) {
                if (!(HasState(STATE_AIMING)) && sprites.readDataNumber(Character, "Mana") > 30) {
                    sprites.changeDataNumberBy(Character, "Mana", -30)
                    AddState(STATE_CASTING, true, [STATE_BLOCKING, STATE_AIMING, STATE_ATTACK], true)
                    PlayCheckedTimedStateAnimation(800, true)
                    CastAttack()
                }
            }
            if (Action == STATE_ATTACK) {
                AddState(STATE_ATTACK, true, [STATE_BLOCKING, STATE_AIMING, STATE_CASTING], true)
                PlayCheckedTimedStateAnimation(150, true)
                music.play(music.createSoundEffect(WaveShape.Noise, 1736, 259, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
            }
            if (Action == STATE_AIMING) {
                AddState(STATE_AIMING, true, [STATE_BLOCKING, STATE_ATTACK, STATE_CASTING], true)
                STATE_AIMING_DURATION = game.runtime()
                PlayCheckedTimedStateAnimation(0, false)
                AttachBow()
                AimingBow(true)
            }
            if (Action == STATE_BLOCKING) {
                AddState(STATE_BLOCKING, true, [STATE_ATTACK, STATE_AIMING, STATE_CASTING], true)
                PlayCheckedTimedStateAnimation(0, false)
                AttachShield()
                music.play(music.createSoundEffect(WaveShape.Noise, 634, 1686, 255, 0, 100, SoundExpressionEffect.Warble, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
            }
            if (Action == STATE_ULTIMATE) {
                AddState(STATE_ULTIMATE, true, [
                STATE_ATTACK,
                STATE_AIMING,
                STATE_CASTING,
                STATE_BLOCKING,
                STATE_JUMP
                ], true)
                AimingBow(false)
                PlayCheckedTimedStateAnimation(0, false)
                ChargeAndReleaseUltimate()
            }
        }
        if (Action == STATE_JUMP) {
            if (Character.isHittingTile(CollisionDirection.Bottom)) {
                music.play(music.createSoundEffect(WaveShape.Square, 400, 600, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
                AddState(STATE_JUMP, true, [], false)
                Character.vy = -135
                PlayCheckedTimedStateAnimation(100, false)
                if (HasState(STATE_AIMING)) {
                    angle = Math.min(angle + randint(28, 33), 90)
                }
            }
        }
    }
}
function AttachShield () {
    Character_Shield.setFlag(SpriteFlag.Invisible, false)
    timer.background(function () {
        while (HasState(STATE_BLOCKING)) {
            Character_Shield.setPosition(Character.x + 6, Character.y)
            pause(10)
        }
        Character_Shield.setFlag(SpriteFlag.Invisible, true)
    })
}
function AttachBow () {
    Character_Bow.setFlag(SpriteFlag.Invisible, false)
    animation.runImageAnimation(
    Character_Bow,
    assets.animation`playerBowAnim`,
    200,
    false
    )
    timer.background(function () {
        while (HasState(STATE_AIMING)) {
            Character_Bow.setPosition(Character.x - 1, Character.y)
            pause(10)
        }
        Character_Bow.setFlag(SpriteFlag.Invisible, true)
    })
}
function CreateForeground (num: number) {
    LastCeilingForeground = sprites.create(Backdrops[0][0]._pickRandom(), SpriteKind.Foreground)
    LastCeilingForeground.setFlag(SpriteFlag.Ghost, true)
    LastCeilingForeground.setFlag(SpriteFlag.AutoDestroy, false)
    LastCeilingForeground.bottom = scene.screenHeight() - 84
    LastCeilingForeground.left = num
    LastCeilingForeground.z = -100
    LastFloorForeground = sprites.create(Backdrops[0][1]._pickRandom(), SpriteKind.Foreground)
    LastFloorForeground.setFlag(SpriteFlag.Ghost, true)
    LastFloorForeground.setFlag(SpriteFlag.AutoDestroy, false)
    LastFloorForeground.bottom = scene.screenHeight() - 8
    LastFloorForeground.left = num
    LastFloorForeground.z = -100
}
function SetupStatusBars () {
    ICON_CHARACTER = sprites.create(assets.image`xTear_Icon`, SpriteKind.Icon)
    TEXT_CHARACTER_LEVEL = textsprite.create("Lv" + GAME_PLAYER_LEVEL, 12, 4)
    TEXT_CHARACTER_LEVEL.setMaxFontHeight(5)
    TEXT_CHARACTER_LEVEL.setPosition(scene.cameraProperty(CameraProperty.Left) + 12, scene.cameraProperty(CameraProperty.Top) + 19)
    TEXT_CHARACTER_LEVEL.z = 1001
    ICON_CHARACTER.setPosition(scene.cameraProperty(CameraProperty.Left) + 8, scene.cameraProperty(CameraProperty.Top) + 9)
    TEXT_HP = textsprite.create("HP", 12, 2)
    TEXT_HP.setMaxFontHeight(5)
    TEXT_HP.setIcon(assets.image`Icon_HP`)
    TEXT_HP.setPosition(scene.cameraProperty(CameraProperty.Left) + 26, scene.cameraProperty(CameraProperty.Top) + 5)
    TEXT_HP.z = 1000
    SB_Player_HP = statusbars.create(85, 6, StatusBarKind.player)
    SB_Player_HP.setColor(3, 2)
    SB_Player_HP.setBarBorder(1, 12)
    SB_Player_HP.setPosition(scene.cameraProperty(CameraProperty.Left) + 76, scene.cameraProperty(CameraProperty.Top) + 0)
    SB_Player_HP.max = 40
    TEXT_MANA = textsprite.create("MP", 8, 9)
    TEXT_MANA.setMaxFontHeight(5)
    TEXT_MANA.setIcon(assets.image`Icon_MP`)
    TEXT_MANA.setPosition(scene.cameraProperty(CameraProperty.Left) + 26, scene.cameraProperty(CameraProperty.Top) + 13)
    TEXT_MANA.z = 1000
    SB_Player_Mana = statusbars.create(85, 6, StatusBarKind.player)
    SB_Player_Mana.setColor(9, 8)
    SB_Player_Mana.setBarBorder(1, 8)
    SB_Player_Mana.setPosition(scene.cameraProperty(CameraProperty.Left) + 76, scene.cameraProperty(CameraProperty.Top) + 6)
    SB_Player_Mana.setStatusBarFlag(StatusBarFlag.SmoothTransition, false)
    SB_Player_Mana.max = 100
    SB_Player_XP = statusbars.create(103, 5, StatusBarKind.player)
    SB_Player_XP.setStatusBarFlag(StatusBarFlag.SmoothTransition, false)
    SB_Player_XP.setColor(5, 15)
    SB_Player_XP.setBarBorder(1, 10)
    SB_Player_XP.setPosition(scene.cameraProperty(CameraProperty.Left) + 67, scene.cameraProperty(CameraProperty.Top) + 12)
    SB_Player_XP.max = 1000
    SB_Player_XP.value = 0
    timer.background(function () {
        while (true) {
            UpdateStatusBars()
            pause(50)
        }
    })
}
function CastAttack () {
    for (let index = 0; index < 3; index++) {
        if (GetClosestLivingEntity()) {
            AddVectorFireball(Character, ClosestEnemy.x, ClosestEnemy.y, 10)
        } else {
            AddVectorFireball(Character, 152, 94, 20)
        }
        pause(50)
    }
}
function StartGame () {
    sprites.destroyAllSpritesOfKind(SpriteKind.SplashScreen)
    CreatePlayerComponent()
    InventorySlotManager()
    INPUT_MODE = INPUT_GAME
    GAME_RUNNING = true
}
function PLAYER_PASSIVE_REGENERATION () {
    if (INPUT_MODE == INPUT_GAME) {
        if (sprites.readDataNumber(Character, "Mana") < sprites.readDataNumber(Character, "MaxMana")) {
            sprites.changeDataNumberBy(Character, "Mana", 1)
        }
        if (sprites.readDataNumber(Character, "Health") < sprites.readDataNumber(Character, "MaxHealth")) {
            sprites.changeDataNumberBy(Character, "Health", 0.25)
        }
    }
}
controller.B.onEvent(ControllerButtonEvent.Released, function () {
    if (INPUT_MODE == INPUT_GAME && GAME_RUNNING) {
        RemoveState(STATE_ULTIMATE)
    }
})
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    if (INPUT_MODE == INPUT_GAME && GAME_RUNNING) {
        if (!(HasState(STATE_ULTIMATE))) {
            RemoveState(STATE_AIMING)
            AimingBow(false)
        }
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (sprites.readDataString(sprite, "ProjectileType") == "PROJECTILE_FIREBALL") {
        if (!(sprites.readDataSprite(sprite, "Instigator") == otherSprite)) {
            AddExplosion(EXPLOSION_FIREBALL, 2, 3, sprite.x, sprite.y, sprite)
            sprites.destroy(sprite)
        }
    }
    if (sprites.readDataString(sprite, "ProjectileType") == "PROJECTILE_ARROW") {
        if (!(sprites.readDataSprite(sprite, "Instigator") == otherSprite)) {
            DoDamage(otherSprite, sprite)
            AddExplosion(EXPLOSION_FIREBALL, 2, 3, sprite.x, sprite.y, sprite)
            sprites.destroy(sprite)
        }
    }
})
let TEXT_MANA: TextSprite = null
let TEXT_HP: TextSprite = null
let ICON_CHARACTER: Sprite = null
let LastCeilingForeground: Sprite = null
let STATE_AIMING_DURATION = 0
let myMenu: Sprite = null
let LastCeilingBackground: Sprite = null
let Character_Bow: Sprite = null
let Character_Shield: Sprite = null
let ClosestEnemyDistance = 0
let ClosestEnemy: Sprite = null
let Instructions: Sprite = null
let textSprite: TextSprite = null
let ULTIMATE_CHARGE = 0
let PlayerArrowDistance = 0
let PlayerArrowDY = 0
let PlayerArrowDX = 0
let arrow: Sprite = null
let RETICLE_RADIUS = 0
let RANGED_WEAPON_RETICLE: Sprite = null
let RANGED_WEAPON_CONTROL = 0
let BOW_CHARGE = 0
let angle = 0
let j = 0
let LevelUps = 0
let CharacterStates: string[] = []
let ProjectileDY = 0
let ProjectileDX = 0
let Fireball: Sprite = null
let ENTITY_ATTACK_DAMAGE: number[][] = []
let ENTITY_SPEED_INDEX: number[][] = []
let ENTITY_HEALTH_INDEX: number[][] = []
let STATE_IDLERUN = ""
let STATE_AIMING = ""
let STATE_BLOCKING = ""
let STATE_JUMP = ""
let INPUT_LOCKED = ""
let Slot: Sprite = null
let TEXT_CHARACTER_LEVEL: TextSprite = null
let MENU_SHOW_SUCCESS: Sprite = null
let MENU_SELECT_OPTION: Sprite = null
let ENTITY_HURT_FRAME: Image[][] = []
let ENTITY_ANIM_IDLERUN: Image[][][] = []
let GAME_PLAY_BUTTON: Sprite = null
let GAME_LOGO: Sprite = null
let GAME_SPLASH_TEXT: TextSprite = null
let GAME_PLAYER_XP_NEEDED = 0
let SB_Player_XP: StatusBarSprite = null
let SB_Player_Mana: StatusBarSprite = null
let SB_Player_HP: StatusBarSprite = null
let LEVEL_BANNER: Sprite = null
let GAME_PLAYER_XP = 0
let GAME_PLAYER_LEVEL = 0
let PetrifiedWither_Star: Sprite = null
let PetrifiedWither_Arms: Sprite = null
let Character: Sprite = null
let STATE_ULTIMATE = ""
let MENU_SAVELOAD: Sprite = null
let SB_ENTITY: StatusBarSprite = null
let Entity: Sprite = null
let STATE_CASTING = ""
let INPUT_GAME = ""
let INPUT_MODE = ""
let LastFloorBackground: Sprite = null
let LastFloorForeground: Sprite = null
let Backdrops: Image[][][] = []
let EXPLOSION_TNT = ""
let EXPLOSION_FIREBALL = ""
let EXPLOSION_MAGIC = ""
let ExplosionEffect: Sprite = null
let EffectSystem: Sprite = null
let IFrameDuration = 0
let STATE_ATTACK = ""
let bMenuOpen = false
let GAME_INTRO_RUNNING = false
let GAME_RUNNING = false
music.setVolume(255)
GAME_RUNNING = false
GAME_INTRO_RUNNING = false
spriteutils.setConsoleOverlay(false)
tiles.setCurrentTilemap(tilemap`overworld_tilemap`)
scene.centerCameraAt(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y) + 6)
StartingConstruction()
DATA_CHECK()
ShowSplashScreen()
pauseUntil(() => controller.A.isPressed() && !(bMenuOpen))
Cutscene(0)
StartGame()
Play_Level(1)
