struct ComplexStruct {
    intValue: Int;
    boolValue: Bool;
    stringValue: String?;
    addressValue: Address;
}

contract Test {
    init() {}
    
    fun test() {
        let cs: ComplexStruct = ComplexStruct{ 
            intValue: 42, 
            boolValue: true, 
            stringValue: null,
            addressValue: address("EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp")
        };
        let ComplexStruct{ intValu3, boolValue, stringValue, addressValue } = cs; // Should suggest "intValue"
    }
    
    receive() {}
}