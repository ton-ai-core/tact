contract Test {
    init() {}
    
    fun test(): Address {
        return addres("EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp"); // Should suggest "address"
    }
    
    receive() {}
}