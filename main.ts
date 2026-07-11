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
controller.down.onEvent(ControllerButtonEvent.Released, function () {
    if (INPUT_MODE == "Game") {
        STATE_AIMING_DURATION = game.runtime() - STATE_AIMING_DURATION
        RemoveState(STATE_AIMING)
    }
})
function HasState (State: string) {
    return CharacterStates.indexOf(State) >= 0
}
function AddState (State: string, SelfMutex: boolean, MutexStates: string[], AddFirst: boolean) {
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
function RemoveState (State: string) {
    j = CharacterStates.indexOf(State)
    if (j >= 0) {
        CharacterStates.removeAt(j)
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
    Character = sprites.create(img`
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
        `, SpriteKind.Player)
    Character.ay = 400
    CharacterStates = []
    animation.runImageAnimation(
    Character,
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
    200,
    false
    )
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
            Character_RecycleState(STATE_ATTACK, 400)
        }
        if (Action == STATE_CASTING) {
            if (!(HasState(STATE_AIMING))) {
                AddState(STATE_CASTING, true, [STATE_BLOCKING, STATE_AIMING, STATE_ATTACK], true)
                Character_RecycleState(STATE_CASTING, 400)
            }
        }
        if (Action == STATE_AIMING) {
            AddState(STATE_AIMING, true, [STATE_BLOCKING, STATE_ATTACK, STATE_CASTING], true)
            STATE_AIMING_DURATION = game.runtime()
        }
        if (Action == STATE_BLOCKING) {
            AddState(STATE_BLOCKING, true, [STATE_ATTACK, STATE_AIMING, STATE_CASTING], true)
        }
        if (Action == STATE_JUMP) {
            if (Character.isHittingTile(CollisionDirection.Bottom)) {
                AddState(STATE_JUMP, true, [], false)
                Character.vy = -135
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
    }
}
function Character_RecycleState (State: string, AnimationDuration: number) {
    pause(AnimationDuration)
    RemoveState(State)
}
let j = 0
let CharacterStates: string[] = []
let STATE_AIMING_DURATION = 0
let Character: Sprite = null
let STATE_ULTIMATE = ""
let STATE_CASTING = ""
let STATE_AIMING = ""
let STATE_BLOCKING = ""
let STATE_ATTACK = ""
let STATE_JUMP = ""
let INPUT_MODE = ""
INPUT_MODE = "Game"
STATE_JUMP = "Jump"
STATE_ATTACK = "Attack"
STATE_BLOCKING = "Blocking"
STATE_AIMING = "Aiming"
STATE_CASTING = "Casting"
STATE_ULTIMATE = "Ultimate"
let STATE_IDLERUN = "IdleRun"
CreatePlayerComponent()
scene.setBackgroundColor(8)
tiles.setCurrentTilemap(tilemap`level1`)
tiles.placeOnTile(Character, tiles.getTileLocation(2, 6))
game.onUpdate(function () {
    // Debug display of the current state list
    Character.sayText(CharacterStates.length == 0 ? STATE_IDLERUN : CharacterStates.join(","), 100, false)
})
