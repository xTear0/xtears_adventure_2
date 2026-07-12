namespace SpriteKind {
    export const Effect = SpriteKind.create()
    export const Explosion = SpriteKind.create()
}
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
function AddExplosion (ExplosionType: string, Size: number, Damage: number, x: number, y: number, PlayerImmune: boolean) {
    ExplosionEffect = sprites.create(assets.image`ExplosionSprite`, SpriteKind.Explosion)
    sprites.setDataBoolean(ExplosionEffect, "PlayerImmune", PlayerImmune)
    sprites.setDataNumber(ExplosionEffect, "BlastDamage", Damage)
    ExplosionEffect.setPosition(x, y)
    ExplosionEffect.scale = Size
    scene.cameraShake(Size * 5, 400)
    if (ExplosionType == EXPLOSION_MAGIC) {
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
        animation.runImageAnimation(
        ExplosionEffect,
        [img`
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
            `],
        500,
        false
        )
    } else if (ExplosionType == EXPLOSION_TNT) {
        animation.runImageAnimation(
        ExplosionEffect,
        [img`
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
            `],
        500,
        false
        )
    }
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == "Game") {
        DoAction(STATE_CASTING)
    }
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (Character.isHittingTile(CollisionDirection.Bottom) && HasState(STATE_JUMP)) {
        RemoveState(STATE_JUMP)
    }
})
function AddEntity (ID: number, Location: tiles.Location) {
    Entity = sprites.create(GetEntity_Frame_Hurt(ID), SpriteKind.Enemy)
    sprites.setDataNumber(Entity, "ID", ID)
    sprites.setDataNumber(Entity, "Health", GetEntity_Health_Index(ID))
    sprites.setDataNumber(Entity, "AttackDamage", GetEntity_Attack_Damage(ID))
    Entity.setVelocity(GetEntity_Speed_Index(ID), 0)
    Entity.setStayInScreen(false)
    Entity.setFlag(SpriteFlag.GhostThroughWalls, true)
    animation.runImageAnimation(
    Entity,
    GetEntity_Anim_IdleRun(ID),
    100,
    true
    )
    tiles.placeOnTile(Entity, tiles.getTileLocation(Location.column, Location.row))
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
    if (INPUT_MODE == "Game") {
        DoAction(STATE_ULTIMATE)
    }
})
function GetEntity_Frame_Hurt (ID: number) {
    return ENTITY_HURT_FRAME[parseFloat(convertToText(ID).substr(0, 1)) - 1][parseFloat(convertToText(ID).substr(1, convertToText(ID).length - 1)) - 1]
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == "Game") {
        DoAction(STATE_JUMP)
    }
})
function StartingConstruction () {
    EXPLOSION_TNT = "TNT"
    EXPLOSION_MAGIC = "MAGIC"
    EXPLOSION_FIREBALL = "FIREBALL"
    INPUT_MODE = "Game"
    STATE_JUMP = "Jump"
    STATE_ATTACK = "Attack"
    STATE_BLOCKING = "Blocking"
    STATE_AIMING = "Aiming"
    STATE_CASTING = "Casting"
    STATE_ULTIMATE = "Ultimate"
    STATE_IDLERUN = "IdleRun"
    IFrameDuration = 100
    ENTITY_ANIM_IDLERUN = [[
    assets.animation`mobAnimation`,
    assets.animation`mobAnimation2`,
    assets.animation`mobAnimation3`,
    assets.animation`mobAnimation4`
    ], [
    assets.animation`mobAnimation`,
    assets.animation`mobAnimation2`,
    assets.animation`mobAnimation3`,
    assets.animation`mobAnimation4`
    ], [
    assets.animation`mobAnimation`,
    assets.animation`mobAnimation2`,
    assets.animation`mobAnimation3`,
    assets.animation`mobAnimation4`
    ]]
    ENTITY_HURT_FRAME = [[
    assets.image`mobHurt`,
    assets.image`mobHurt2`,
    assets.image`mobHurt3`,
    assets.image`mobHurt4`
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
function AddVectorFireball (Instigator: Sprite, Target: Sprite, AccuracyRange: number) {
	
}
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    if (INPUT_MODE == "Game") {
        if (!(HasState(STATE_ULTIMATE))) {
            RemoveState(STATE_AIMING)
            AimingBow(false)
        }
    }
})
function HasState (State: string) {
    return CharacterStates.indexOf(State) >= 0
}
function AddVectorEffect (Type: string, Instigator: Sprite, Target: Sprite, AccuracyRange: number) {
	
}
function AddState (State: string, SelfMutex: boolean, MutexStates: string[], AddFirst: boolean) {
    if (HasState(STATE_IDLERUN)) {
        CharacterStates.removeAt(CharacterStates.indexOf(STATE_IDLERUN))
    }
    for (let index = 0; index <= CharacterStates.length - 1; index++) {
        if (MutexStates.indexOf(CharacterStates[index]) >= 0 || (SelfMutex && CharacterStates[index]) == State) {
            CharacterStates.removeAt(index)
        }
    }
    if (AddFirst) {
        CharacterStates.unshift(State)
    } else {
        CharacterStates.push(State)
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == "Game") {
        DoAction(STATE_BLOCKING)
    }
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
        assets.animation`player_idlerun`,
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
    if (INPUT_MODE == "Game") {
        if (!(HasState(STATE_ULTIMATE))) {
            RemoveState(STATE_BLOCKING)
        }
    }
})
function GetEntity_Attack_Damage (ID: number) {
    return ENTITY_ATTACK_DAMAGE[parseFloat(convertToText(ID).substr(0, 1)) - 1][parseFloat(convertToText(ID).substr(1, convertToText(ID).length - 1)) - 1]
}
function DoContactDamage (Victim: Sprite, Instigator: Sprite) {
    sprites.setDataNumber(Victim, "Health", sprites.readDataNumber(Victim, "Health") - sprites.readDataNumber(Instigator, "AttackDamage"))
    if (Victim != Character) {
        music.play(music.createSoundEffect(WaveShape.Square, 200, 1, 255, 0, 100, SoundExpressionEffect.None, InterpolationCurve.Curve), music.PlaybackMode.InBackground)
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
    }
    if (sprites.readDataNumber(Victim, "Health") <= 0) {
        sprites.destroy(Victim, effects.spray, 100)
    }
}
function GetEntity_Speed_Index (ID: number) {
    return ENTITY_SPEED_INDEX[parseFloat(convertToText(ID).substr(0, 1)) - 1][parseFloat(convertToText(ID).substr(1, convertToText(ID).length - 1)) - 1] * -1
}
function AimingBow (_true: boolean) {
    if (_true) {
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
    if (INPUT_MODE == "Game") {
        DoAction(STATE_ATTACK)
    }
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
        INPUT_MODE = "Locked"
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
            AddExplosion(EXPLOSION_MAGIC, 1, 20, Character.x, Character.y, true)
        })
    }
}
function GetEntity_Health_Index (ID: number) {
    return ENTITY_HEALTH_INDEX[parseFloat(convertToText(ID).substr(0, 1)) - 1][parseFloat(convertToText(ID).substr(1, convertToText(ID).length - 1)) - 1]
}
function CreatePlayerComponent () {
    Character = sprites.create(assets.image`xtear_sprite`, SpriteKind.Player)
    Character.ay = 400
    CharacterStates = []
    sprites.setDataNumber(Character, "Health", 40)
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
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == "Game") {
        DoAction(STATE_AIMING)
    }
})
controller.B.onEvent(ControllerButtonEvent.Released, function () {
    if (INPUT_MODE == "Game") {
        RemoveState(STATE_ULTIMATE)
    }
})
function DoAction (Action: string) {
    if (!(HasState(STATE_ULTIMATE))) {
        if (Action == STATE_ATTACK) {
            AddState(STATE_ATTACK, true, [STATE_BLOCKING, STATE_AIMING, STATE_CASTING], true)
            PlayCheckedTimedStateAnimation(150, true)
        }
        if (Action == STATE_CASTING) {
            if (!(HasState(STATE_AIMING))) {
                AddState(STATE_CASTING, true, [STATE_BLOCKING, STATE_AIMING, STATE_ATTACK], true)
                PlayCheckedTimedStateAnimation(400, true)
            }
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    while (HasState(STATE_ATTACK)) {
        DoContactDamage(otherSprite, sprite)
        pause(IFrameDuration)
    }
})
let STATE_AIMING_DURATION = 0
let Character_Bow: Sprite = null
let Character_Shield: Sprite = null
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
let CharacterStates: string[] = []
let ENTITY_ATTACK_DAMAGE: number[][] = []
let ENTITY_SPEED_INDEX: number[][] = []
let ENTITY_HEALTH_INDEX: number[][] = []
let ENTITY_ANIM_IDLERUN: Image[][][] = []
let IFrameDuration = 0
let STATE_IDLERUN = ""
let STATE_AIMING = ""
let STATE_BLOCKING = ""
let STATE_ATTACK = ""
let ENTITY_HURT_FRAME: Image[][] = []
let STATE_ULTIMATE = ""
let Entity: Sprite = null
let STATE_JUMP = ""
let STATE_CASTING = ""
let INPUT_MODE = ""
let EXPLOSION_TNT = ""
let EXPLOSION_FIREBALL = ""
let EXPLOSION_MAGIC = ""
let ExplosionEffect: Sprite = null
let EffectSystem: Sprite = null
let Character: Sprite = null
StartingConstruction()
CreatePlayerComponent()
tiles.setCurrentTilemap(tilemap`level1`)
tiles.placeOnTile(Character, tiles.getTileLocation(2, 6))
AddEntity(11, tiles.getTileLocation(8, 6))
game.onUpdate(function () {
    // Debug display of the current state list
    Character.sayText(CharacterStates, 100, false)
})
