contract Test {
    init() {}
    
    fun test() {
        reqire(true, "test"); // Should suggest "require"
    }
    
    receive() {}
}