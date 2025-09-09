contract Test {
    init() {}
    
    fun test() {
        dmp(42); // Should suggest "dump"
    }
    
    receive() {}
}