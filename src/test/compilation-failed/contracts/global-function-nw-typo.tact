contract Test {
    init() {}
    
    fun test(): Int {
        return nw(); // Should suggest "now"
    }
    
    receive() {}
}