namespace SpriteKind {
    export const Effect = SpriteKind.create()
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
function AddExplosion (ExplosionType: string, Size: number, Damage: number, x: number, y: number) {
	
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == "Game") {
        DoAction(STATE_CASTING)
    }
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (Character.isHittingTile(CollisionDirection.Bottom)) {
        RemoveState(STATE_JUMP)
    }
})
function AddEntity (ID: number, Location: tiles.Location) {
    Entity = sprites.create(assets.image`constructArrays10`, SpriteKind.Enemy)
    animation.runImageAnimation(
    Entity,
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
    tiles.placeOnTile(Entity, tiles.getTileLocation(Location.column, Location.row))
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == "Game") {
        DoAction(STATE_ULTIMATE)
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == "Game") {
        DoAction(STATE_JUMP)
    }
})
function StartingConstruction () {
    INPUT_MODE = "Game"
    STATE_JUMP = "Jump"
    STATE_ATTACK = "Attack"
    STATE_BLOCKING = "Blocking"
    STATE_AIMING = "Aiming"
    STATE_CASTING = "Casting"
    STATE_ULTIMATE = "Ultimate"
    STATE_IDLERUN = "IdleRun"
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
    ENTITY_ANIM_HURT = [[
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
}
function AddVectorFireball (Instigator: Sprite, Target: Sprite, AccuracyRange: number) {
	
}
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    if (INPUT_MODE == "Game") {
        STATE_AIMING_DURATION = game.runtime() - STATE_AIMING_DURATION
        RemoveState(STATE_AIMING)
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
function RemoveState (State: string) {
    j = CharacterStates.indexOf(State)
    if (j >= 0) {
        CharacterStates.removeAt(j)
    }
    if (CharacterStates.length == 0) {
        AddState(STATE_IDLERUN, true, [], false)
        PlayCheckedTimedStateAnimation(0, false)
    }
}
controller.left.onEvent(ControllerButtonEvent.Released, function () {
    if (INPUT_MODE == "Game") {
        RemoveState(STATE_BLOCKING)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (INPUT_MODE == "Game") {
        DoAction(STATE_ATTACK)
    }
})
function CreatePlayerComponent () {
    Character = sprites.create(assets.image`xtear_sprite`, SpriteKind.Player)
    Character.ay = 400
    CharacterStates = []
    animation.runImageAnimation(
    Character,
    assets.animation`player_idlerun`,
    175,
    true
    )
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
        }
        if (Action == STATE_BLOCKING) {
            AddState(STATE_BLOCKING, true, [STATE_ATTACK, STATE_AIMING, STATE_CASTING], true)
            PlayCheckedTimedStateAnimation(0, false)
            AttachShield()
        }
        if (Action == STATE_JUMP) {
            if (Character.isHittingTile(CollisionDirection.Bottom)) {
                AddState(STATE_JUMP, true, [], false)
                Character.vy = -135
                PlayCheckedTimedStateAnimation(100, false)
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
        PlayCheckedTimedStateAnimation(0, false)
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
let Character_Bow: Sprite = null
let Character_Shield: Sprite = null
let j = 0
let CharacterStates: string[] = []
let STATE_AIMING_DURATION = 0
let ENTITY_ANIM_HURT: Image[][][] = []
let ENTITY_ANIM_IDLERUN: Image[][][] = []
let STATE_IDLERUN = ""
let STATE_AIMING = ""
let STATE_BLOCKING = ""
let STATE_ATTACK = ""
let STATE_ULTIMATE = ""
let Entity: Sprite = null
let STATE_JUMP = ""
let STATE_CASTING = ""
let INPUT_MODE = ""
let EffectSystem: Sprite = null
let Character: Sprite = null
StartingConstruction()
CreatePlayerComponent()
tiles.setCurrentTilemap(tilemap`level1`)
tiles.placeOnTile(Character, tiles.getTileLocation(2, 6))
AddEntity(21, tiles.getTileLocation(8, 6))
game.onUpdate(function () {
    // Debug display of the current state list
    Character.sayText(CharacterStates, 100, false)
})
