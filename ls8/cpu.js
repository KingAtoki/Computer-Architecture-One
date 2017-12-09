const INIT = 0b00000001;
const SET = 0b00000010;
const SAVE = 0b00000100;
const MUL = 0b00000101;
const PRN = 0b00000110;
const HALT = 0b00000000;

class CPU {
  constructor() {
    this.mem = new Array(256);
    this.mem.fill(0);

    this.curReg = 0;
    this.reg = new Array(256);
    this.reg.fill(0);

    this.reg.PC = 0;

    this.buildBranchTable();
  }
  /**
   * Build the branch table
   */
  buildBranchTable() {
    this.branchTable = {
      [INIT]: this.INIT,
      [SET]: this.SET,
      [SAVE]: this.SAVE,
      [MUL]: this.MUL,
      [PRN]: this.PRN,
      [HALT]: this.HALT
    };
  }

  /**
   * Poke values into memory
   */
  poke(address, value) {
    this.mem[address] = value;
  }

  /**
   * start the clock
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1);
  }

  /**
   * Stop the clock
   */

  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * Each tick of the clock
   */

  tick() {
    // run the instructions
    const currentInstruction = this.mem[this.reg.PC];

    const handler = this.branchTable[currentInstruction];

    if (handler === undefined) {
      console.error('ERR: Invalid instructions ' + currentInstruction);
      this.stopClock();
      return;
    }

    handler.call(this); // set this explicitly in handler
  }

  /**
   * Handle INIT
   */
  INIT() {
    console.log('INIT');
    this.curReg = 0;

    this.reg.PC++; //got to the next instruction
  }

  /**
   * Handle SET
   */
  SET() {
    const reg = this.mem[this.reg.PC + 1];
    console.log('SET ' + reg);
    this.curReg = reg;

    this.reg.PC += 2;
  }

  /**
   * Handle SAVE
   */
  SAVE() {
    const val = this.mem[this.reg.PC + 1];
    console.log('SAVE ' + val);

    // Store the value in the current register
    this.reg[this.curReg] = val;

    this.reg.PC += 2;
  }

  /**
   * Handle MUL
   */
  MUL() {
    const reg0 = this.mem[this.reg.PC + 1];
    const reg1 = this.mem[this.reg.PC + 2];

    const regVal0 = this.reg[reg0];
    const regVal1 = this.reg[reg1];

    this.reg[this.curReg] = regVal0 * regVal1;

    console.log(`MUL ${reg0} ${reg1}`);

    this.reg.PC += 3; // Go to the next instruction
  }

  /**
   * PRN
   */
  PRN() {
    console.log('PRN');
    console.log(this.reg[this.curReg]);
    this.reg.PC++;
  }
  /**
   * HALT
   */
  HALT() {
    this.stopClock();
  }
}

module.exports = CPU;
