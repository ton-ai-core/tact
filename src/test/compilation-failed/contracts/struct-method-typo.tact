struct TestStruct {
    value: Int;
    
    fun getValue(): Int {
        return self.value;
    }
    
    fun setValue(v: Int) {
        self.value = v;
    }
}

contract Test {
    init() {}
    
    fun test() {
        let s: TestStruct = TestStruct{ value: 42 };
        let v = s.getValu3(); // Should suggest "getValue"
    }
    
    receive() {}
}